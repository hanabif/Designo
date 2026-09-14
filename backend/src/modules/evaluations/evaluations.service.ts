import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { EvaluationStatus, InterviewStatus } from '@prisma/client';
import type { Queue } from 'bullmq';
import { PrismaService } from '../../database/prisma.service.js';
import { EVALUATION_JOB, EVALUATION_QUEUE } from './evaluation.types.js';

@Injectable()
export class EvaluationsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(EVALUATION_QUEUE) private readonly queue: Queue,
  ) {}

  async request(userId: string, interviewId: string) {
    const interview = await this.prisma.interview.findFirst({ where: { id: interviewId, userId } });
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
    await this.queue.add(EVALUATION_JOB, { evaluationId: report.id }, {
      jobId: `evaluation:${report.id}`,
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
      removeOnComplete: 100,
      removeOnFail: 100,
    });
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
