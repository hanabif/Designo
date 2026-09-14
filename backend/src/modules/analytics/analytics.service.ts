import { Injectable } from '@nestjs/common';
import { EvaluationStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';

const categories = [
  ['requirements', 'requirementsScore'], ['architecture', 'architectureScore'],
  ['scalability', 'scalabilityScore'], ['databaseDesign', 'databaseDesignScore'],
  ['reliability', 'reliabilityScore'], ['security', 'securityScore'],
  ['costAwareness', 'costAwarenessScore'],
] as const;

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard(userId: string) {
    const [interviews, reports] = await Promise.all([
      this.prisma.interview.findMany({ where: { userId }, select: { id: true, createdAt: true, status: true } }),
      this.prisma.evaluationReport.findMany({
        where: { status: EvaluationStatus.COMPLETED, interview: { userId } },
        select: { overallScore: true, requirementsScore: true, architectureScore: true, scalabilityScore: true, databaseDesignScore: true, reliabilityScore: true, securityScore: true, costAwarenessScore: true },
      }),
    ]);
    const scores = reports.map((report) => report.overallScore).filter((score): score is number => score !== null);
    const averages = Object.fromEntries(categories.map(([label, field]) => {
      const values = reports.map((report) => report[field]).filter((score): score is number => score !== null);
      return [label, values.length ? Math.round(values.reduce((sum, score) => sum + score, 0) / values.length) : null];
    }));
    const ordered = Object.entries(averages).filter((entry): entry is [string, number] => entry[1] !== null).sort((a, b) => a[1] - b[1]);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
    return {
      interviewMetrics: { totalInterviews: interviews.length, interviewsThisMonth: interviews.filter((interview) => interview.createdAt >= monthStart).length, practiceHours: 0 },
      performanceMetrics: { averageScore: this.average(scores), bestScore: scores.length ? Math.max(...scores) : null, worstScore: scores.length ? Math.min(...scores) : null },
      categoryMetrics: averages,
      learningMetrics: { weakAreas: ordered.slice(0, 3).map(([category]) => category), strongAreas: ordered.slice(-3).reverse().map(([category]) => category) },
    };
  }

  async progress(userId: string) {
    const reports = await this.prisma.evaluationReport.findMany({
      where: { status: EvaluationStatus.COMPLETED, interview: { userId } },
      select: { overallScore: true, generatedAt: true, interview: { select: { id: true, createdAt: true, question: { select: { title: true } } } } },
      orderBy: { generatedAt: 'asc' },
    });
    return reports.map((report) => ({ interviewId: report.interview.id, questionTitle: report.interview.question.title, completedAt: report.generatedAt ?? report.interview.createdAt, overallScore: report.overallScore }));
  }

  private average(values: number[]) { return values.length ? Math.round(values.reduce((sum, score) => sum + score, 0) / values.length) : null; }
}
