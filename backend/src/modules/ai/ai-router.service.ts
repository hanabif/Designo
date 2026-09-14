import { Injectable, Logger } from '@nestjs/common';
import { GeminiProvider } from './providers/gemini.provider.js';
import { GroqProvider } from './providers/groq.provider.js';
import { OpenRouterProvider } from './providers/openrouter.provider.js';
import { DeterministicFallbackProvider } from './providers/deterministic-fallback.provider.js';
import {
  AiCompletionOptions,
  AiCompletionResponse,
  AiMessage,
  AiProvider,
  AiUseCase,
} from './interfaces/ai-provider.interface.js';

@Injectable()
export class AiRouterService {
  private readonly logger = new Logger(AiRouterService.name);

  constructor(
    private readonly gemini: GeminiProvider,
    private readonly groq: GroqProvider,
    private readonly openRouter: OpenRouterProvider,
    private readonly deterministicFallback: DeterministicFallbackProvider,
  ) {}

  selectProviderChain(useCase: AiUseCase): AiProvider[] {
    const providers: AiProvider[] = [];

    if (useCase === AiUseCase.INTERVIEW_CHAT) {
      // Prioritize Groq for low-latency turn-by-turn chat
      if (this.groq.isConfigured()) providers.push(this.groq);
      if (this.gemini.isConfigured()) providers.push(this.gemini);
      if (this.openRouter.isConfigured()) providers.push(this.openRouter);
    } else {
      // Prioritize Gemini for large context (evaluations, diagram review, recommendation)
      if (this.gemini.isConfigured()) providers.push(this.gemini);
      if (this.groq.isConfigured()) providers.push(this.groq);
      if (this.openRouter.isConfigured()) providers.push(this.openRouter);
    }

    // Always append deterministic fallback to guarantee system reliability
    providers.push(this.deterministicFallback);
    return providers;
  }

  async execute(
    useCase: AiUseCase,
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<AiCompletionResponse> {
    const chain = this.selectProviderChain(useCase);
    let lastError: Error | null = null;

    for (const provider of chain) {
      try {
        this.logger.log(
          `Executing AI task [${useCase}] via provider [${provider.name}]`,
        );
        return await provider.generateCompletion(messages, options);
      } catch (err: any) {
        lastError = err instanceof Error ? err : new Error(String(err));
        this.logger.warn(
          `Provider [${provider.name}] failed for use-case [${useCase}]: ${lastError.message}. Attempting failover...`,
        );
      }
    }

    throw lastError ?? new Error('All AI providers failed');
  }
}
