import { describe, expect, it, vi } from 'vitest';
import { AiUseCase } from '../ai/interfaces/ai-provider.interface.js';
import { EvaluationProvider } from './evaluation.provider.js';

const context = {
  question: {
    title: 'Design WhatsApp',
    description: 'Design a messaging platform.',
    expectedComponents: ['WebSocket gateway', 'Message queue'],
  },
  messages: [
    { role: 'USER', content: 'I would use WebSockets for delivery.', stage: 'HIGH_LEVEL_DESIGN' },
  ],
};

const structuredEvaluation = JSON.stringify({
  overallScore: 81,
  requirementsScore: 80,
  architectureScore: 82,
  scalabilityScore: 80,
  databaseDesignScore: 80,
  reliabilityScore: 80,
  securityScore: 80,
  costAwarenessScore: 80,
  strengths: ['Clear communication of trade-offs.'],
  weaknesses: ['Missed cache invalidation strategy.'],
  recommendations: ['Add a CDN layer for static assets.'],
});

describe('EvaluationProvider', () => {
  it('requests a JSON evaluation through the AI router and validates the result', async () => {
    const ai = {
      execute: vi.fn().mockResolvedValue({
        content: structuredEvaluation,
        provider: 'groq',
        model: 'qwen/qwen3.8-27b',
      }),
    };
    const provider = new EvaluationProvider(ai as any);

    const result = await provider.evaluate(context);

    expect(ai.execute).toHaveBeenCalledWith(
      AiUseCase.EVALUATION,
      expect.arrayContaining([{ role: 'user', content: JSON.stringify(context) }]),
      { responseFormat: 'json_object' },
    );
    expect(result.overallScore).toBe(81);
    expect(result.strengths).toEqual(['Clear communication of trade-offs.']);
  });

  it('throws when the model output is not valid JSON', async () => {
    const ai = {
      execute: vi.fn().mockResolvedValue({
        content: 'not json',
        provider: 'groq',
        model: 'qwen/qwen3.8-27b',
      }),
    };
    const provider = new EvaluationProvider(ai as any);

    await expect(provider.evaluate(context)).rejects.toThrow(/invalid JSON/);
  });

  it('throws when the JSON is missing required score fields', async () => {
    const ai = {
      execute: vi.fn().mockResolvedValue({
        content: JSON.stringify({ overallScore: 81 }),
        provider: 'groq',
        model: 'qwen/qwen3.8-27b',
      }),
    };
    const provider = new EvaluationProvider(ai as any);

    await expect(provider.evaluate(context)).rejects.toThrow(/invalid overallScore|invalid requirementsScore/);
  });
});