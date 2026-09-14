import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { AiRouterService } from './ai-router.service.js';
import {
  AI_QUEUE_DEFAULT_OPTIONS,
  AI_QUEUE_NAME,
  AiJobPayload,
} from './processors/ai-queue.processor.js';
import {
  AiCompletionOptions,
  AiCompletionResponse,
  AiMessage,
  AiUseCase,
} from './interfaces/ai-provider.interface.js';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly router: AiRouterService,
    @InjectQueue(AI_QUEUE_NAME) private readonly aiQueue: Queue<AiJobPayload>,
  ) {}

  async enqueue(payload: AiJobPayload) {
    this.logger.log(`Enqueuing AI job for use-case [${payload.useCase}]`);
    const job = await this.aiQueue.add(
      `ai-${payload.useCase.toLowerCase()}`,
      payload,
      AI_QUEUE_DEFAULT_OPTIONS,
    );
    return { jobId: job.id, status: 'ENQUEUED' };
  }

  async executeDirect(
    useCase: AiUseCase,
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<AiCompletionResponse> {
    return this.router.execute(useCase, messages, options);
  }
}
