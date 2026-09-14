import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AiModule } from '../ai/ai.module.js';
import { EvaluationsModule } from '../evaluations/evaluations.module.js';
import { InterviewsController } from './interviews.controller.js';
import { InterviewsService } from './interviews.service.js';

@Module({
  imports: [DatabaseModule, EvaluationsModule, AiModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
  exports: [InterviewsService],
})
export class InterviewsModule {}
