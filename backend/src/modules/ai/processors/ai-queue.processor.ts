import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { AiRouterService } from '../ai-router.service.js';
import {
  AiCompletionOptions,
  AiCompletionResponse,
  AiMessage,
  AiUseCase,
} from '../interfaces/ai-provider.interface.js';

export interface AiJobPayload {
  useCase: AiUseCase;
  messages: AiMessage[];
  options?: AiCompletionOptions;
  callbackMetadata?: Record<string, unknown>;
}

export const AI_QUEUE_NAME = 'ai-execution';

export const AI_QUEUE_DEFAULT_OPTIONS = {
  attempts: 5,
  backoff: {
    type: 'exponential' as const,
    delay: 2000, // 2s, 4s, 8s, 16s, 32s for free-tier rate-limit mitigation
  },
  removeOnComplete: 100,
  removeOnFail: 500,
};

@Processor(AI_QUEUE_NAME)
export class AiQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(AiQueueProcessor.name);

  constructor(private readonly router: AiRouterService) {
    super();
  }

  async process(job: Job<AiJobPayload>): Promise<AiCompletionResponse> {
    const { useCase, messages, options, callbackMetadata } = job.data;
    this.logger.log(
      `Processing queued AI job [${job.id}] for use-case [${useCase}] (Attempt ${job.attemptsMade + 1}/${job.opts.attempts})`,
    );

    try {
      const response = await this.router.execute(useCase, messages, options);
      this.logger.log(
        `Successfully completed queued AI job [${job.id}] via [${response.provider}:${response.model}]`,
      );
      return response;
    } catch (error: any) {
      const isRateLimit =
        error?.status === 429 ||
        error?.message?.includes('429') ||
        error?.message?.includes('rate limit');

      if (isRateLimit) {
        this.logger.warn(
          `Free-tier 429 rate limit encountered on job [${job.id}]. BullMQ will retry with exponential backoff.`,
        );
      } else {
        this.logger.error(
          `AI job [${job.id}] failed: ${error?.message ?? String(error)}`,
        );
      }

      throw error;
    }
  }
}
