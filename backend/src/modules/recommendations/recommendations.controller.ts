import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { AppAuthGuard } from '../../common/guards/app-auth.guard.js';
import { RecommendationsService } from './recommendations.service.js';

@Controller('recommendations')
@UseGuards(AppAuthGuard)
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Get()
  getRecommendations(@CurrentUser('id') userId: string) {
    return this.recommendationsService.getRecommendations(userId);
  }
}
