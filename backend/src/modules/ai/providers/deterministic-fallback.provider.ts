import { Injectable, Logger } from '@nestjs/common';
import {
  AiCompletionOptions,
  AiCompletionResponse,
  AiMessage,
  AiProvider,
} from '../interfaces/ai-provider.interface.js';

@Injectable()
export class DeterministicFallbackProvider implements AiProvider {
  readonly name = 'deterministic-fallback';
  private readonly logger = new Logger(DeterministicFallbackProvider.name);

  isConfigured(): boolean {
    return true;
  }

  async generateCompletion(
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<AiCompletionResponse> {
    this.logger.warn(
      'No primary AI API keys configured; serving deterministic development mock response.',
    );

    if (options?.responseFormat === 'json_object') {
      const mockJson = JSON.stringify({
        overallScore: 78,
        requirementsScore: 80,
        architectureScore: 75,
        scalabilityScore: 75,
        databaseDesignScore: 80,
        reliabilityScore: 75,
        securityScore: 80,
        costAwarenessScore: 70,
        strengths: [
          'Solid understanding of functional requirements.',
          'Good choice of database index strategies.',
        ],
        weaknesses: [
          'Single point of failure in load balancing layer.',
          'Limited quantitative throughput estimations.',
        ],
        recommendations: [
          'Explore redundant load balancer pairs (VRRP/Keepalived).',
          'Practice back-of-the-envelope capacity calculations.',
        ],
      });

      return {
        content: mockJson,
        provider: this.name,
        model: 'dev-deterministic-v1',
      };
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

    return {
      content: `[Development Mock Response] I received your input: "${lastUserMessage.slice(0, 80)}...". What about non-functional requirements such as target latency and throughput?`,
      provider: this.name,
      model: 'dev-deterministic-v1',
    };
  }
}
