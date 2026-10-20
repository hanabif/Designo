import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Difficulty } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateQuestionDto } from './dto/create-question.dto.js';
import { GenerateQuestionDto } from './dto/generate-question.dto.js';
import { UpdateQuestionDto } from './dto/update-question.dto.js';
import { AiRouterService } from '../ai/ai-router.service.js';
import { AiUseCase } from '../ai/interfaces/ai-provider.interface.js';

const VALID_DIFFICULTIES = new Set<string>(Object.values(Difficulty));

interface GeneratedQuestion {
  title: string;
  description: string;
  expectedComponents: string[];
  tags: string[];
  difficulty: Difficulty;
}

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiRouter: AiRouterService,
  ) {}

  async create(dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: dto,
    });
  }

  /**
   * FR-09 support: produce a practice question for a roadmap gap.
   *
   * 1. Dedupe — if the bank already has a question for this topic, return it
   *    instead of burning tokens (and polluting the bank with duplicates).
   * 2. Otherwise generate ONE question through the AI provider chain
   *    (Gemini-first, deterministic failover) in the spec's FR-03 schema.
   * 3. Malformed AI output degrades to a deterministic template so the
   *    endpoint always succeeds for a signed-in user.
   */
  async generate(dto: GenerateQuestionDto): Promise<{ question: unknown; generated: boolean }> {
    // Normalise the incoming topic: roadmap gap titles arrive in raw form like
    // "Improve COST fundamentals (Current score: 45)" — strip the parenthetical
    // and the leading verb so search/dedupe/generation all key on the
    // meaningful phrase ("COST fundamentals").
    const topic =
      dto.topic
        .replace(/\([^)]*\)/g, ' ')
        .replace(/^(improve|focus on|work on|strengthen|practice|reduce)\s+/i, '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 120) || dto.topic.trim();
    if (!topic) {
      throw new BadRequestException('A topic is required');
    }

    const existing = await this.prisma.question.findFirst({
      where: {
        OR: [
          { title: { contains: topic, mode: 'insensitive' } },
          { tags: { has: topic } },
          { tags: { has: topic.toLowerCase() } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    if (existing) {
      return { question: existing, generated: false };
    }

    let generated: GeneratedQuestion | null = null;
    try {
      const response = await this.aiRouter.execute(
        AiUseCase.QUESTION_GENERATION,
        [
          {
            role: 'system',
            content:
              'You are a senior system-design interviewer authoring a single practice question. ' +
              'Respond with JSON only — no markdown, no commentary.',
          },
          {
            role: 'user',
            content:
              `Create ONE system-design practice question for the topic/weak area: "${topic}".\n` +
              (dto.difficulty
                ? `Set difficulty to exactly ${dto.difficulty}.\n`
                : 'Pick the difficulty (BEGINNER, INTERMEDIATE, ADVANCED, STAFF) that best fits how broad and deep this topic is.\n') +
              'Requirements:\n' +
              `- The phrase "${topic}" must appear in the description.\n` +
              '- The question must be answerable as a full mock-interview session (requirements → high-level design → deep dive).\n' +
              '- 3-6 expectedComponents (concepts the answer should cover).\n' +
              '- 2-5 short lowercase tags; always include the topic slug.\n' +
              'JSON shape: {"title": string, "description": string, "expectedComponents": string[], ' +
              '"tags": string[], "difficulty": "BEGINNER"|"INTERMEDIATE"|"ADVANCED"|"STAFF"}',
          },
        ],
        { responseFormat: 'json_object', temperature: 0.7, maxTokens: 800 },
      );
      generated = this.parseGenerated(response.content, topic, dto.difficulty);
    } catch (error) {
      this.logger.warn(
        `Question generation AI failed for "${topic}": ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    if (!generated) {
      generated = this.templateGenerated(topic, dto.difficulty);
    }

    const question = await this.prisma.question.create({ data: generated });
    return { question, generated: true };
  }

  /** Defensive parse of the model's JSON into the FR-03 question schema. */
  private parseGenerated(
    content: string,
    topic: string,
    requested?: Difficulty,
  ): GeneratedQuestion | null {
    try {
      const cleaned = content
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```$/, '');
      const parsed = JSON.parse(cleaned) as Partial<GeneratedQuestion>;

      const title = typeof parsed.title === 'string' ? parsed.title.trim() : '';
      const description =
        typeof parsed.description === 'string' ? parsed.description.trim() : '';
      if (!title || !description) return null;

      const asStringArray = (value: unknown): string[] =>
        Array.isArray(value)
          ? value.filter(
              (item): item is string =>
                typeof item === 'string' && item.trim().length > 0,
            )
          : [];

      const tags = asStringArray(parsed.tags).map((tag) => tag.trim().toLowerCase());
      if (!tags.some((tag) => tag === topic.toLowerCase())) {
        tags.push(topic.toLowerCase());
      }

      const rawDifficulty = String(parsed.difficulty ?? '').toUpperCase();
      const difficulty: Difficulty = VALID_DIFFICULTIES.has(rawDifficulty)
        ? (rawDifficulty as Difficulty)
        : (requested ?? Difficulty.INTERMEDIATE);

      return {
        title,
        description: description.toLowerCase().includes(topic.toLowerCase())
          ? description
          : `${description}\n\nFocus area: ${topic}.`,
        expectedComponents: asStringArray(parsed.expectedComponents),
        tags,
        difficulty,
      };
    } catch {
      return null;
    }
  }

  /** Works with zero AI configuration — the endpoint never dead-ends. */
  private templateGenerated(topic: string, requested?: Difficulty): GeneratedQuestion {
    return {
      title: `${topic} — System Design Practice`,
      description:
        `Run a full mock-interview loop centred on "${topic}". Walk through functional requirements ` +
        'and constraints, sketch a high-level architecture, then deep-dive into the trade-offs that ' +
        `matter most for this area — including failure modes, scaling behaviour and cost implications. ` +
        `The evaluation will pay special attention to ${topic}.`,
      expectedComponents: [
        'Requirements & constraints',
        'High-level architecture',
        'Data model & storage',
        'Scalability & reliability',
        `Deep dive: ${topic}`,
      ],
      tags: [topic.toLowerCase()],
      difficulty: requested ?? Difficulty.INTERMEDIATE,
    };
  }

  async findAll() {
    return this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(id: string, dto: UpdateQuestionDto) {
    try {
      return await this.prisma.question.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new NotFoundException('Question not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.question.delete({
        where: { id },
      });
      return { message: 'Question deleted successfully' };
    } catch {
      throw new NotFoundException('Question not found');
    }
  }
}
