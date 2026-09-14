import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        experienceLevel: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async getPlatformStats() {
    const totalUsers = await this.prisma.user.count();
    const totalInterviews = await this.prisma.interview.count();
    const completedInterviews = await this.prisma.interview.count({ where: { status: 'COMPLETED' } });
    const totalQuestions = await this.prisma.question.count();

    return {
      totalUsers,
      totalInterviews,
      completedInterviews,
      totalQuestions,
      activeSystemVersion: '1.0.0-phase4',
    };
  }
}
