import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AiModule } from '../ai/ai.module.js';
import { DiagramsController } from './diagrams.controller.js';
import { DiagramsService } from './diagrams.service.js';

@Module({
  imports: [DatabaseModule, AiModule],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
