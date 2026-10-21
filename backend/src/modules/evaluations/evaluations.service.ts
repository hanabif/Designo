import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EvaluationStatus, InterviewStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import { EvaluationProvider } from './evaluation.provider.js';

@Injectable()
export class EvaluationsService {
  private readonly logger = new Logger(EvaluationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly provider: EvaluationProvider,
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

    await this.prisma.evaluationReport.update({
      where: { id: report.id },
      data: { status: EvaluationStatus.PROCESSING, failureReason: null },
    });
    try {
      const result = await this.provider.evaluate({
        question: interview.question,
        messages: interview.messages.map(({ role, content, stage }) => ({ role, content, stage })),
      });
      await this.prisma.evaluationReport.update({
        where: { id: report.id },
        data: { ...result, status: EvaluationStatus.COMPLETED, generatedAt: new Date() },
      });
      return this.get(userId, report.id);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown evaluation error';
      this.logger.error(`Evaluation failed for ${report.id}: ${reason}`);
      await this.prisma.evaluationReport.update({
        where: { id: report.id },
        data: { status: EvaluationStatus.FAILED, failureReason: reason },
      });
      return this.get(userId, report.id);
    }
  }

  async get(userId: string, evaluationId: string) {
    const report = await this.prisma.evaluationReport.findFirst({
      where: { id: evaluationId, interview: { userId } },
      include: { interview: { select: { id: true, question: { select: { title: true } } } } },
    });
    if (!report) throw new NotFoundException('Evaluation not found');
    return report;
  }

}
