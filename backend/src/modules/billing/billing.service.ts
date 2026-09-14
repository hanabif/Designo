import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: string, plan: Role) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role: plan },
      select: { id: true, email: true, role: true },
    });

    return {
      status: 'SUCCESS',
      message: `Subscription plan updated to ${plan}`,
      user,
      checkoutUrl: 'https://checkout.designo.app/success',
    };
  }

  async getBillingHistory(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, createdAt: true },
    });

    return {
      currentPlan: user?.role ?? Role.FREE,
      subscriptionDate: user?.createdAt,
      billingHistory: [
        {
          id: 'inv_001',
          date: user?.createdAt ?? new Date(),
          amount: user?.role === Role.PRO ? 29.0 : user?.role === Role.ENTERPRISE ? 99.0 : 0.0,
          currency: 'USD',
          status: 'PAID',
          plan: user?.role ?? Role.FREE,
        },
      ],
    };
  }
}
