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
export class GeminiProvider implements AiProvider {
  readonly name = 'gemini';
  private readonly logger = new Logger(GeminiProvider.name);

  constructor(private readonly config: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.config.get<string>('ai.gemini.apiKey'));
  }

  async generateCompletion(
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<AiCompletionResponse> {
    const apiKey = this.config.get<string>('ai.gemini.apiKey');
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const baseURL = this.config.get<string>('ai.gemini.baseUrl');
    const defaultModel = this.config.get<string>('ai.gemini.model') ?? 'gemini-2.5-flash';
    const model = options?.model ?? defaultModel;

    const client = new OpenAI({ apiKey, baseURL });

    const formattedMessages = [...messages];
    if (options?.systemInstruction) {
      formattedMessages.unshift({ role: 'system', content: options.systemInstruction });
    }

    this.logger.log(`Dispatching request to Gemini model: ${model}`);

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
