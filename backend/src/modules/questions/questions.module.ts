import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller.js';
import { QuestionsService } from './questions.service.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { AiModule } from '../ai/ai.module.js';

@Module({
  imports: [AiModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, RolesGuard],
  exports: [QuestionsService],
})
export class QuestionsModule {}
