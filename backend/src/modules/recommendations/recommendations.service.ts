import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { AiUseCase } from '../ai/interfaces/ai-provider.interface.js';

@Injectable()
export class RecommendationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async getRecommendations(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, targetCompany: true, targetLevel: true, experienceLevel: true },
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
        weakAreas: ['Database Sharding', 'Rate Limiting', 'CAP Theorem'],
        learningRoadmap: [
          {
            topic: 'Database Sharding & Partitioning',
            priority: 'HIGH',
            reason: 'Essential for scalable system design interviews.',
            resources: ['Read Designing Data-Intensive Applications Ch. 6', 'Practice Twitter Feed Architecture'],
          },
          {
            topic: 'Distributed Caching Strategies',
            priority: 'MEDIUM',
            reason: 'Core requirement for low-latency backend designs.',
            resources: ['Redis Cache-Aside pattern', 'Write-through vs Write-back caching'],
          },
        ],
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
      `Analyze candidate profile and category scores: ${JSON.stringify(averages)}.`,
      'Output a JSON object with: { "weakAreas": string[], "learningRoadmap": [{ "topic": string, "priority": "HIGH"|"MEDIUM"|"LOW", "reason": string, "resources": string[] }] }',
    ].join(' ');

    const aiRes = await this.ai.executeDirect(
      AiUseCase.RECOMMENDATION,
      [
        { role: 'system', content: prompt },
        { role: 'user', content: `Target Company: ${user?.targetCompany ?? 'Tier 1 Tech'}. Target Level: ${user?.targetLevel ?? 'Senior'}` },
      ],
      { responseFormat: 'json_object' },
    );

    try {
      return JSON.parse(aiRes.content);
    } catch {
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
  }

  private avg(scores: Array<number | null>): number {
    const valid = scores.filter((s): s is number => s !== null);
    if (!valid.length) return 70;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  }
}
