import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { BillingService } from './billing.service.js';

@Controller('billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('checkout')
  checkout(@CurrentUser('id') userId: string, @Body('plan') plan: Role) {
    return this.billingService.checkout(userId, plan ?? Role.PRO);
  }

  @Get('history')
  getHistory(@CurrentUser('id') userId: string) {
    return this.billingService.getBillingHistory(userId);
  }
}
