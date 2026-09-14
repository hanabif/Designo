import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  AiCompletionOptions,
  AiCompletionResponse,
  AiMessage,
  AiProvider,
} from '../interfaces/ai-provider.interface.js';

@Injectable()
export class OpenRouterProvider implements AiProvider {
  readonly name = 'openrouter';
  private readonly logger = new Logger(OpenRouterProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('ai.openrouter.apiKey'));
  }

  async generateCompletion(
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<AiCompletionResponse> {
    const apiKey = this.config.get<string>('ai.openrouter.apiKey');
    if (!apiKey) {
      throw new Error('OpenRouter API key is not configured');
    }

    const baseURL = this.config.get<string>('ai.openrouter.baseUrl');
    const defaultModel =
      this.config.get<string>('ai.openrouter.model') ?? 'meta-llama/llama-3.3-70b-instruct:free';
    const model = options?.model ?? defaultModel;

    const client = new OpenAI({
      apiKey,
      baseURL,
      defaultHeaders: {
        'HTTP-Referer': 'https://designo.app',
        'X-Title': 'Designo AI Interview Coach',
      },
    });

    const formattedMessages = [...messages];
    if (options?.systemInstruction) {
      formattedMessages.unshift({ role: 'system', content: options.systemInstruction });
    }

    this.logger.log(`Dispatching failover request to OpenRouter model: ${model}`);

    const response = await client.chat.completions.create({
      model,
      messages: formattedMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens,
      response_format:
        options?.responseFormat === 'json_object'
          ? { type: 'json_object' }
          : undefined,
    });

    const content = response.choices[0]?.message?.content ?? '';
    return {
      content,
      provider: this.name,
      model,
      usage: {
        promptTokens: response.usage?.prompt_tokens,
        completionTokens: response.usage?.completion_tokens,
        totalTokens: response.usage?.total_tokens,
      },
    };
  }
}
