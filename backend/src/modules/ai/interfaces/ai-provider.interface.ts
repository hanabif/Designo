export type AiRole = 'system' | 'user' | 'assistant';

export interface AiMessage {
  role: AiRole;
  content: string;
}

export interface AiCompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json_object';
  systemInstruction?: string;
}

export interface AiCompletionResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export enum AiUseCase {
  INTERVIEW_CHAT = 'INTERVIEW_CHAT',
  EVALUATION = 'EVALUATION',
  DIAGRAM_REVIEW = 'DIAGRAM_REVIEW',
  RECOMMENDATION = 'RECOMMENDATION',
}

export interface AiProvider {
  readonly name: string;
  isConfigured(): boolean;
  generateCompletion(
    messages: AiMessage[],
    options?: AiCompletionOptions,
  ): Promise<AiCompletionResponse>;
}
