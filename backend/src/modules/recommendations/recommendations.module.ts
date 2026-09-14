import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AiModule } from '../ai/ai.module.js';
import { RecommendationsController } from './recommendations.controller.js';
import { RecommendationsService } from './recommendations.service.js';

@Module({
  imports: [DatabaseModule, AiModule],
  controllers: [RecommendationsController],
  providers: [RecommendationsService],
  exports: [RecommendationsService],
})
export class RecommendationsModule {}
