import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EvaluationStatus } from '@prisma/client';
import type { Job } from 'bullmq';
import { PrismaService } from '../../database/prisma.service.js';
import { EvaluationProvider } from './evaluation.provider.js';
import { EVALUATION_JOB, EVALUATION_QUEUE } from './evaluation.types.js';

@Processor(EVALUATION_QUEUE)
export class EvaluationsProcessor extends WorkerHost {
  constructor(private readonly prisma: PrismaService, private readonly provider: EvaluationProvider) { super(); }

  async process(job: Job<{ evaluationId: string }>) {
    if (job.name !== EVALUATION_JOB) return;
    const report = await this.prisma.evaluationReport.findUnique({
      where: { id: job.data.evaluationId },
      include: { interview: { include: { question: true, messages: { orderBy: { createdAt: 'asc' } } } } },
    });
    if (!report || report.status === EvaluationStatus.COMPLETED) return;
    await this.prisma.evaluationReport.update({ where: { id: report.id }, data: { status: EvaluationStatus.PROCESSING, failureReason: null } });
    try {
      const result = await this.provider.evaluate({
        question: report.interview.question,
        messages: report.interview.messages.map(({ role, content, stage }) => ({ role, content, stage })),
      });
      await this.prisma.evaluationReport.update({
        where: { id: report.id },
        data: { ...result, status: EvaluationStatus.COMPLETED, generatedAt: new Date() },
      });
    } catch (error) {
      await this.prisma.evaluationReport.update({
        where: { id: report.id },
        data: { status: EvaluationStatus.FAILED, failureReason: error instanceof Error ? error.message : 'Unknown evaluation error' },
      });
      throw error;
    }
  }
}
