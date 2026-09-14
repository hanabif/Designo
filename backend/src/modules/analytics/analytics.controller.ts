import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AnalyticsService } from './analytics.service.js';

@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}
  @Get('dashboard') dashboard(@Request() req: { user: { sub: string } }) { return this.analytics.dashboard(req.user.sub); }
  @Get('progress') progress(@Request() req: { user: { sub: string } }) { return this.analytics.progress(req.user.sub); }
}
