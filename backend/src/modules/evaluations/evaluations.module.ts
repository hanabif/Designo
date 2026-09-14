import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '../../database/database.module.js';
import { EvaluationsController } from './evaluations.controller.js';
import { EvaluationProvider } from './evaluation.provider.js';
import { EvaluationsProcessor } from './evaluations.processor.js';
import { EvaluationsService } from './evaluations.service.js';
import { EVALUATION_QUEUE } from './evaluation.types.js';

@Module({
  imports: [DatabaseModule, BullModule.registerQueue({ name: EVALUATION_QUEUE })],
  controllers: [EvaluationsController],
  providers: [EvaluationProvider, EvaluationsService, EvaluationsProcessor],
  exports: [EvaluationsService],
})
export class EvaluationsModule {}
