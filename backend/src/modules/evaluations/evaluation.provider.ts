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
    const apiKey = this.config.get<string>('openai.apiKey');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY is not configured; using a deterministic development evaluation.');
      return this.developmentResult(context);
    }

    const client = new OpenAI({ apiKey });
    const response = await client.responses.create({
      model: this.config.get<string>('openai.model') ?? 'gpt-5.6-mini',
      store: false,
      instructions: [
        'You are an objective system-design interview evaluator.',
        'Score every category from 0 to 100 using only evidence in the transcript.',
        'The overall score must equal the weighted score: requirements 15%, architecture 25%, scalability 20%, database 10%, reliability 15%, security 10%, cost 5%.',
        'Give concise, actionable feedback. Never invent user statements.',
      ].join(' '),
      input: JSON.stringify(context),
      text: {
        format: {
          type: 'json_schema',
          name: 'system_design_evaluation',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: [...scoreFields, 'strengths', 'weaknesses', 'recommendations'],
            properties: {
              overallScore: { type: 'integer', minimum: 0, maximum: 100 },
              requirementsScore: { type: 'integer', minimum: 0, maximum: 100 },
              architectureScore: { type: 'integer', minimum: 0, maximum: 100 },
              scalabilityScore: { type: 'integer', minimum: 0, maximum: 100 },
              databaseDesignScore: { type: 'integer', minimum: 0, maximum: 100 },
              reliabilityScore: { type: 'integer', minimum: 0, maximum: 100 },
              securityScore: { type: 'integer', minimum: 0, maximum: 100 },
              costAwarenessScore: { type: 'integer', minimum: 0, maximum: 100 },
              strengths: { type: 'array', items: { type: 'string' }, maxItems: 5 },
              weaknesses: { type: 'array', items: { type: 'string' }, maxItems: 5 },
              recommendations: { type: 'array', items: { type: 'string' }, maxItems: 5 },
            },
          },
        },
      },
    } as any);

    return this.validate(JSON.parse(response.output_text));
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
