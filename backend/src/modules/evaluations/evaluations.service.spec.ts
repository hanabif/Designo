import { BadRequestException } from '@nestjs/common';
import { EvaluationStatus, InterviewStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { EvaluationsService } from './evaluations.service.js';

describe('EvaluationsService', () => {
  it('creates and queues an evaluation for a completed interview', async () => {
    const prisma = {
      interview: { findFirst: vi.fn().mockResolvedValue({ id: 'interview-1', status: InterviewStatus.COMPLETED }) },
      evaluationReport: { upsert: vi.fn().mockResolvedValue({ id: 'report-1', status: EvaluationStatus.PENDING }) },
    };
    const queue = { add: vi.fn().mockResolvedValue(undefined) };
    const service = new EvaluationsService(prisma as any, queue as any);

    await expect(service.request('user-1', 'interview-1')).resolves.toMatchObject({ id: 'report-1' });
    expect(queue.add).toHaveBeenCalledWith('generate-evaluation', { evaluationId: 'report-1' }, expect.objectContaining({ jobId: 'evaluation:report-1' }));
  });

  it('rejects evaluation requests before completion', async () => {
    const prisma = { interview: { findFirst: vi.fn().mockResolvedValue({ id: 'interview-1', status: InterviewStatus.IN_PROGRESS }) } };
    const service = new EvaluationsService(prisma as any, { add: vi.fn() } as any);
    await expect(service.request('user-1', 'interview-1')).rejects.toBeInstanceOf(BadRequestException);
  });
});
