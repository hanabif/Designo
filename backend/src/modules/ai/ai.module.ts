import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { GeminiProvider } from './providers/gemini.provider.js';
import { GroqProvider } from './providers/groq.provider.js';
import { OpenRouterProvider } from './providers/openrouter.provider.js';
import { DeterministicFallbackProvider } from './providers/deterministic-fallback.provider.js';
import { AiRouterService } from './ai-router.service.js';
import { AiService } from './ai.service.js';
import { AI_QUEUE_NAME, AiQueueProcessor } from './processors/ai-queue.processor.js';

@Module({
  imports: [
    ConfigModule,
    BullModule.registerQueue({
      name: AI_QUEUE_NAME,
    }),
  ],
  providers: [
    GeminiProvider,
    GroqProvider,
    OpenRouterProvider,
    DeterministicFallbackProvider,
    AiRouterService,
    AiQueueProcessor,
    AiService,
  ],
  exports: [
    AiService,
    AiRouterService,
    GeminiProvider,
    GroqProvider,
    OpenRouterProvider,
    DeterministicFallbackProvider,
  ],
})
export class AiModule {}
