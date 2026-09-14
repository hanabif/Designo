import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { EvaluationStatus, InterviewStatus } from '@prisma/client';
import type { Queue } from 'bullmq';
import { PrismaService } from '../../database/prisma.service.js';
import { EvaluationProvider } from './evaluation.provider.js';
import { EVALUATION_JOB, EVALUATION_QUEUE } from './evaluation.types.js';

@Injectable()
export class EvaluationsService {
  private readonly logger = new Logger(EvaluationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly provider: EvaluationProvider,
    @InjectQueue(EVALUATION_QUEUE) private readonly queue: Queue,
  ) {}

  async request(userId: string, interviewId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: { question: true, messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!interview) throw new NotFoundException('Interview not found');
    if (interview.status !== InterviewStatus.COMPLETED) {
      throw new BadRequestException('Only completed interviews can be evaluated');
    }

    const report = await this.prisma.evaluationReport.upsert({
      where: { interviewId },
      create: { interviewId, status: EvaluationStatus.PENDING },
      update: {},
    });

    if (report.status === EvaluationStatus.COMPLETED) return report;

    try {
      await this.queue.add(
        EVALUATION_JOB,
        { evaluationId: report.id },
        {
          jobId: `evaluation:${report.id}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: 100,
          removeOnFail: 100,
        },
      );
    } catch (err: any) {
      this.logger.warn(
        `Redis evaluation queue unavailable (${err?.message ?? err}). Running direct evaluation fallback.`,
      );

      // Direct fallback processing if Redis queue is offline
      try {
        await this.prisma.evaluationReport.update({
          where: { id: report.id },
          data: { status: EvaluationStatus.PROCESSING },
        });

        const result = await this.provider.evaluate({
          question: interview.question,
          messages: interview.messages.map(({ role, content, stage }) => ({ role, content, stage })),
        });

        const updated = await this.prisma.evaluationReport.update({
          where: { id: report.id },
          data: { ...result, status: EvaluationStatus.COMPLETED, generatedAt: new Date() },
        });

        return updated;
      } catch (evalErr: any) {
        this.logger.error(`Direct evaluation fallback failed: ${evalErr?.message ?? evalErr}`);
      }
    }

    return report;
  }

  async get(userId: string, evaluationId: string) {
    const report = await this.prisma.evaluationReport.findFirst({
      where: { id: evaluationId, interview: { userId } },
      include: { interview: { select: { id: true, question: { select: { title: true } } } } },
    });
    if (!report) throw new NotFoundException('Evaluation not found');
    return report;
  }

  async requestForCompletedInterview(userId: string, interviewId: string) {
    return this.request(userId, interviewId);
  }
}
