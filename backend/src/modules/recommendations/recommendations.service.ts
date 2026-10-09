import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { AiUseCase } from '../ai/interfaces/ai-provider.interface.js';

@Injectable()
export class RecommendationsService {
  /** Cap on the LLM call so `GET /recommendations` never hangs for minutes. */
  private static readonly AI_TIMEOUT_MS = 30_000;

  private readonly logger = new Logger(RecommendationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async getRecommendations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, currentPosition: true, targetCompany: true, targetLevel: true, experienceLevel: true },
    });

    const evaluations = await this.prisma.evaluationReport.findMany({
      where: {
        interview: { userId },
        status: 'COMPLETED',
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (!evaluations.length) {
      return {
        weakAreas: [],
        learningRoadmap: [],
      };
    }

    // Calculate average scores across categories
    const averages = {
      requirements: this.avg(evaluations.map((e) => e.requirementsScore)),
      architecture: this.avg(evaluations.map((e) => e.architectureScore)),
      scalability: this.avg(evaluations.map((e) => e.scalabilityScore)),
      database: this.avg(evaluations.map((e) => e.databaseDesignScore)),
      reliability: this.avg(evaluations.map((e) => e.reliabilityScore)),
      security: this.avg(evaluations.map((e) => e.securityScore)),
      cost: this.avg(evaluations.map((e) => e.costAwarenessScore)),
    };

    const prompt = [
      'You are a senior system design interview mentor.',
      `Tailor recommendations for the candidate's role: ${user?.currentPosition ?? 'software engineer'}.`,
      `Analyze candidate profile and category scores: ${JSON.stringify(averages)}.`,
      'Output a JSON object with: { "weakAreas": string[], "learningRoadmap": [{ "topic": string, "priority": "HIGH"|"MEDIUM"|"LOW", "reason": string, "resources": string[] }] }',
    ].join(' ');

    // The provider chain can be slow or fail outright. Bound the call so this
    // endpoint always responds, and degrade to a roadmap derived straight from
    // the category averages rather than hanging the client or throwing a 500.
    let payload: unknown = null;
    try {
      const aiRes = await this.withTimeout(
        this.ai.executeDirect(
          AiUseCase.RECOMMENDATION,
          [
            { role: 'system', content: prompt },
            { role: 'user', content: `Target Company: ${user?.targetCompany ?? 'Tier 1 Tech'}. Target Level: ${user?.targetLevel ?? user?.experienceLevel ?? 'Senior'}` },
          ],
          { responseFormat: 'json_object' },
        ),
        RecommendationsService.AI_TIMEOUT_MS,
      );
      payload = JSON.parse(aiRes.content);
    } catch (error) {
      this.logger.warn(
        `Recommendation AI unavailable, using deterministic roadmap: ${error instanceof Error ? error.message : String(error)}`,
      );
      payload = null;
    }

    return this.normalize(payload, averages);
  }

  /**
   * Accept the AI payload only when it actually carries usable entries. A model
   * that returns `{}` or a malformed shape must degrade to the deterministic
   * roadmap rather than render an empty page.
   */
  private normalize(
    payload: unknown,
    averages: Record<string, number>,
  ): { weakAreas: string[]; learningRoadmap: unknown[] } {
    const record = (payload ?? {}) as { weakAreas?: unknown; learningRoadmap?: unknown };

    const weakAreas = Array.isArray(record.weakAreas)
      ? record.weakAreas.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      : [];

    const learningRoadmap = Array.isArray(record.learningRoadmap)
      ? record.learningRoadmap.filter(
          (item) =>
            typeof (item as { topic?: unknown } | null)?.topic === 'string' &&
            String((item as { topic: string }).topic).trim().length > 0,
        )
      : [];

    if (weakAreas.length || learningRoadmap.length) {
      return { weakAreas, learningRoadmap };
    }
    return this.fallbackRoadmap(averages);
  }

  /** Roadmap derived purely from the lowest-scoring categories. */
  private fallbackRoadmap(averages: Record<string, number>) {
    const sortedWeak = Object.entries(averages).sort((a, b) => a[1] - b[1]);
    return {
      weakAreas: sortedWeak.slice(0, 3).map((w) => w[0]),
      learningRoadmap: sortedWeak.slice(0, 3).map(([category, score]) => ({
        topic: `Improve ${category.toUpperCase()} fundamentals (Current score: ${score})`,
        priority: 'HIGH',
        reason: `Your evaluation score in ${category} is lower than target threshold.`,
        resources: [`Practice ${category} trade-offs in mock sessions`, 'Review systemic failure scenarios'],
      })),
    };
  }

  /** Rejects a provider that does not answer within `ms`. */
  private withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`AI recommendation timed out after ${ms}ms`)), ms);
      promise.then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        (error) => {
          clearTimeout(timer);
          reject(error);
        },
      );
    });
  }

  private avg(scores: Array<number | null>): number {
    const valid = scores.filter((s): s is number => s !== null);
    if (!valid.length) return 70;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  }
}
