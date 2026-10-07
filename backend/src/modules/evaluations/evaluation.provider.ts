import { Injectable, Logger } from '@nestjs/common';
import { AiRouterService } from '../ai/ai-router.service.js';
import { AiUseCase } from '../ai/interfaces/ai-provider.interface.js';
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

  constructor(private readonly ai: AiRouterService) {}

  async evaluate(context: EvaluationContext): Promise<EvaluationResult> {
    const response = await this.ai.execute(
      AiUseCase.EVALUATION,
      [
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
      { responseFormat: 'json_object' },
    );

    this.logger.log(
      `Evaluation generated via provider [${response.provider}:${response.model}]`,
    );
    if (!response.content) throw new Error('AI provider returned an empty response');

    let parsed: unknown;
    try {
      parsed = JSON.parse(response.content);
    } catch {
      throw new Error('AI provider returned invalid JSON for the evaluation');
    }
    return this.validate(parsed);
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
}
