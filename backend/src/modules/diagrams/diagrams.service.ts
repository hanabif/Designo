import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DiagramFormat } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { AiService } from '../ai/ai.service.js';
import { AiUseCase } from '../ai/interfaces/ai-provider.interface.js';
import { GenerateDiagramDto } from './dto/generate-diagram.dto.js';
import { ReviewDiagramDto } from './dto/review-diagram.dto.js';

@Injectable()
export class DiagramsService {
  private readonly logger = new Logger(DiagramsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) {}

  async generate(userId: string, dto: GenerateDiagramDto) {
    const format = dto.format ?? DiagramFormat.MERMAID;

    let diagramCode = `graph TD\n  Client[Client Application] --> API[API Gateway]\n  API --> Service[Core Service]\n  Service --> Cache[(Redis Cache)]\n  Service --> DB[(PostgreSQL)]`;
    let aiProvider = 'unavailable';
    let aiModel = 'none';

    const systemPrompt = [
      'You are an expert system design architect.',
      'Generate a clean, syntactically valid Mermaid.js flowchart (graph TD or sequenceDiagram) matching the user specification.',
      'Output ONLY valid raw Mermaid code inside your response. Do not include markdown codeblock wrappers.',
    ].join(' ');

    try {
      const aiRes = await this.ai.executeDirect(
        AiUseCase.DIAGRAM_REVIEW,
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Design architecture diagram for: "${dto.prompt}". Title: ${dto.title}` },
        ],
      );

      aiProvider = aiRes.provider;
      aiModel = aiRes.model;

      // Only persist output that is actually Mermaid, and never the
      // deterministic dev mock (it returns canned chat text, not diagrams).
      const extracted = this.extractMermaid(aiRes.content);
      if (extracted && aiRes.provider !== 'deterministic-fallback') {
        diagramCode = extracted;
      } else {
        this.logger.warn(
          `AI diagram output rejected (provider=${aiRes.provider}); using static sample topology instead.`,
        );
      }
    } catch (err: any) {
      this.logger.warn(`AI diagram generation fallback used: ${err?.message ?? err}`);
    }

    const diagram = await this.prisma.diagram.create({
      data: {
        userId,
        interviewId: dto.interviewId,
        title: dto.title,
        prompt: dto.prompt,
        format,
        diagramCode,
      },
    });

    return { ...diagram, aiProvider, aiModel };
  }

  /**
   * Pull raw Mermaid out of an AI response (strips markdown fences and any
   * leading prose). Returns null when the response contains no Mermaid block.
   */
  private extractMermaid(content: string): string | null {
    let raw = (content ?? '').trim();
    if (raw.startsWith('```')) {
      raw = raw.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    }
    const keyword = /^(graph|flowchart|sequenceDiagram|erDiagram|classDiagram|stateDiagram(?:-v2)?|journey|gantt|pie|mindmap|timeline|gitGraph)\b/i;
    const match = keyword.exec(raw);
    if (!match) return null;
    return raw.slice(match.index).trim();
  }

  async review(userId: string, dto: ReviewDiagramDto) {
    const diagram = await this.prisma.diagram.findFirst({
      where: { id: dto.diagramId, userId },
    });

    if (!diagram) {
      throw new NotFoundException('Diagram not found');
    }

    const codeToReview = dto.diagramCode ?? diagram.diagramCode;

    let parsed: any = {
      completenessScore: 82,
      spofRisks: ['Single database instance without read-replica fallback.'],
      securityRisks: ['Missing WAF / API rate limiting tier.'],
      scalabilityRisks: ['Monolithic core service boundary.'],
      reliabilityRisks: ['No circuit breaker specified on external service dependency.'],
      summary: 'Solid foundational design, but requires multi-AZ database replication and caching tiers for production workloads.',
    };

    const systemPrompt = [
      'You are a principal cloud systems architect auditing a system diagram.',
      'Analyze the diagram for Single Points of Failure (SPOF), security risks, scalability risks, and reliability risks.',
      'Respond in valid JSON with schema:',
      '{ "completenessScore": number (0-100), "spofRisks": string[], "securityRisks": string[], "scalabilityRisks": string[], "reliabilityRisks": string[], "summary": string }',
    ].join(' ');

    let aiProvider = 'unavailable';
    let aiModel = 'none';

    try {
      const aiRes = await this.ai.executeDirect(
        AiUseCase.DIAGRAM_REVIEW,
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Diagram Code:\n${codeToReview}` },
        ],
        { responseFormat: 'json_object' },
      );

      aiProvider = aiRes.provider;
      aiModel = aiRes.model;

      // The deterministic fallback returns evaluation-shaped JSON (not the
      // diagram schema) — ignore it and keep the diagram-specific default.
      if (aiRes.provider !== 'deterministic-fallback') {
        const candidate = JSON.parse(aiRes.content);
        const looksLikeDiagramReview =
          typeof candidate?.completenessScore === 'number' ||
          Array.isArray(candidate?.spofRisks) ||
          Array.isArray(candidate?.securityRisks) ||
          Array.isArray(candidate?.scalabilityRisks) ||
          Array.isArray(candidate?.reliabilityRisks);
        if (looksLikeDiagramReview) {
          parsed = candidate;
        } else {
          this.logger.warn('AI diagram review returned an unexpected JSON shape; using default findings.');
        }
      }
    } catch (err: any) {
      this.logger.warn(`AI diagram review fallback used: ${err?.message ?? err}`);
    }

    const reviewRecord = await this.prisma.diagramReview.create({
      data: {
        diagramId: diagram.id,
        completenessScore: parsed.completenessScore ?? 80,
        spofRisks: Array.isArray(parsed.spofRisks) ? parsed.spofRisks : [],
        securityRisks: Array.isArray(parsed.securityRisks) ? parsed.securityRisks : [],
        scalabilityRisks: Array.isArray(parsed.scalabilityRisks) ? parsed.scalabilityRisks : [],
        reliabilityRisks: Array.isArray(parsed.reliabilityRisks) ? parsed.reliabilityRisks : [],
        summary: parsed.summary ?? 'Architecture review completed.',
      },
    });

    return { ...reviewRecord, aiProvider, aiModel };
  }

  async getDiagram(userId: string, id: string) {
    const diagram = await this.prisma.diagram.findFirst({
      where: { id, userId },
      include: {
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!diagram) throw new NotFoundException('Diagram not found');
    return diagram;
  }

  async getUserDiagrams(userId: string) {
    return this.prisma.diagram.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: { take: 1, orderBy: { createdAt: 'desc' } },
      },
    });
  }
}
