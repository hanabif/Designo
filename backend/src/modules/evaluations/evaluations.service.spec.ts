import { BadRequestException } from '@nestjs/common';
import { EvaluationStatus, InterviewStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { EvaluationsService } from './evaluations.service.js';

describe('EvaluationsService', () => {
  it('returns the completed report after scoring a completed interview', async () => {
    const prisma = {
      interview: { findFirst: vi.fn().mockResolvedValue({ id: 'interview-1', status: InterviewStatus.COMPLETED, question: {}, messages: [] }) },
      evaluationReport: { upsert: vi.fn().mockResolvedValue({ id: 'report-1', status: EvaluationStatus.PENDING }) },
      $transaction: vi.fn(),
    };
    const result = {
      overallScore: 80, requirementsScore: 80, architectureScore: 80,
      scalabilityScore: 80, databaseDesignScore: 80, reliabilityScore: 80,
      securityScore: 80, costAwarenessScore: 80, strengths: [], weaknesses: [], recommendations: [],
    };
    const prismaWithReport = {
      ...prisma,
      evaluationReport: {
        ...prisma.evaluationReport,
        update: vi.fn().mockResolvedValue({ id: 'report-1', status: EvaluationStatus.COMPLETED }),
        findFirst: vi.fn().mockResolvedValue({ id: 'report-1', status: EvaluationStatus.COMPLETED }),
      },
    };
    const provider = { evaluate: vi.fn().mockResolvedValue(result) };
    const service = new EvaluationsService(prismaWithReport as any, provider as any);

    await expect(service.request('user-1', 'interview-1')).resolves.toMatchObject({ id: 'report-1', status: EvaluationStatus.COMPLETED });
    expect(provider.evaluate).toHaveBeenCalledOnce();
  });

  it('rejects evaluation requests before completion', async () => {
    const prisma = { interview: { findFirst: vi.fn().mockResolvedValue({ id: 'interview-1', status: InterviewStatus.IN_PROGRESS }) } };
    const provider = { evaluate: vi.fn() };
    const service = new EvaluationsService(prisma as any, provider as any);
    await expect(service.request('user-1', 'interview-1')).rejects.toBeInstanceOf(BadRequestException);
  });
});
