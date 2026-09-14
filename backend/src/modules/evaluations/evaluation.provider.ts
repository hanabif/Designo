import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { EvaluationResult } from './evaluation.types.js';

export interface EvaluationContext {
  question: { title: string; description: string; expectedComponents: string[] };
  messages: Array<{ role: string; content: string; stage: string }>;
}

const scoreFields = [
  'overallScore', 'requirementsScore', 'architectureScore', 'scalabilityScore',
  'databaseDesignScore', 'reliabilityScore', 'securityScore', 'costAwarenessScore',
] as const;

@Injectable()
export class EvaluationProvider {
  private readonly logger = new Logger(EvaluationProvider.name);

  constructor(private readonly config: ConfigService) {}

  async evaluate(context: EvaluationContext): Promise<EvaluationResult> {
    const apiKey = this.config.get<string>('ai.apiKey') ?? this.config.get<string>('openai.apiKey');
    if (!apiKey) {
      this.logger.warn('Neither GEMINI_API_KEY nor OPENAI_API_KEY is configured; using a deterministic development evaluation.');
      return this.developmentResult(context);
    }

    const baseURL = this.config.get<string>('ai.baseUrl');
    const client = new OpenAI({ apiKey, baseURL: baseURL || undefined });
    const model = this.config.get<string>('ai.model') ?? 'gemini-2.5-flash';

    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: [
            'You are an objective system-design interview evaluator.',
            'Score every category from 0 to 100 using only evidence in the transcript.',
            'The overall score must equal the weighted score: requirements 15%, architecture 25%, scalability 20%, database 10%, reliability 15%, security 10%, cost 5%.',
            'Respond with valid JSON containing: overallScore, requirementsScore, architectureScore, scalabilityScore, databaseDesignScore, reliabilityScore, securityScore, costAwarenessScore, strengths (array of strings), weaknesses (array of strings), recommendations (array of strings).',
          ].join(' '),
        },
        {
          role: 'user',
          content: JSON.stringify(context),
        },
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('AI provider returned an empty response');
    return this.validate(JSON.parse(content));
  }

  private validate(value: unknown): EvaluationResult {
    if (!value || typeof value !== 'object') throw new Error('Evaluation provider returned no structured output');
    const result = value as Record<string, unknown>;
    for (const field of scoreFields) {
      if (!Number.isInteger(result[field]) || (result[field] as number) < 0 || (result[field] as number) > 100) {
        throw new Error(`Evaluation provider returned an invalid ${field}`);
      }
    }
    for (const field of ['strengths', 'weaknesses', 'recommendations']) {
      if (!Array.isArray(result[field]) || !result[field].every((entry) => typeof entry === 'string')) {
        throw new Error(`Evaluation provider returned invalid ${field}`);
      }
    }
    return result as unknown as EvaluationResult;
  }

  private developmentResult(context: EvaluationContext): EvaluationResult {
    const answerCount = context.messages.filter((message) => message.role === 'USER').length;
    const score = Math.min(75, 35 + answerCount * 5);
    return {
      overallScore: score, requirementsScore: score, architectureScore: score,
      scalabilityScore: score, databaseDesignScore: score, reliabilityScore: score,
      securityScore: score, costAwarenessScore: score,
      strengths: answerCount ? ['Completed a persisted interview response flow.'] : [],
      weaknesses: answerCount ? ['Development evaluation: configure OPENAI_API_KEY for transcript-specific feedback.'] : ['No candidate responses were recorded.'],
      recommendations: ['Review trade-offs, failure modes, and capacity estimates before the next session.'],
    };
  }
}
