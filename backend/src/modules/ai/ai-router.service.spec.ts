import { describe, expect, it, vi } from 'vitest';
import { AiRouterService } from './ai-router.service.js';
import { AiUseCase } from './interfaces/ai-provider.interface.js';

describe('AiRouterService', () => {
  it('prioritizes Groq for INTERVIEW_CHAT low-latency use case when configured', () => {
    const gemini = { name: 'gemini', isConfigured: () => true, generateCompletion: vi.fn() };
    const groq = { name: 'groq', isConfigured: () => true, generateCompletion: vi.fn() };
    const openRouter = { name: 'openrouter', isConfigured: () => true, generateCompletion: vi.fn() };
    const fallback = { name: 'deterministic-fallback', isConfigured: () => true, generateCompletion: vi.fn() };

    const router = new AiRouterService(
      gemini as any,
      groq as any,
      openRouter as any,
      fallback as any,
    );

    const chain = router.selectProviderChain(AiUseCase.INTERVIEW_CHAT);
    expect(chain[0].name).toBe('groq');
    expect(chain[1].name).toBe('gemini');
  });

  it('prioritizes Gemini for EVALUATION large-context use case when configured', () => {
    const gemini = { name: 'gemini', isConfigured: () => true, generateCompletion: vi.fn() };
    const groq = { name: 'groq', isConfigured: () => true, generateCompletion: vi.fn() };
    const openRouter = { name: 'openrouter', isConfigured: () => true, generateCompletion: vi.fn() };
    const fallback = { name: 'deterministic-fallback', isConfigured: () => true, generateCompletion: vi.fn() };

    const router = new AiRouterService(
      gemini as any,
      groq as any,
      openRouter as any,
      fallback as any,
    );

    const chain = router.selectProviderChain(AiUseCase.EVALUATION);
    expect(chain[0].name).toBe('gemini');
    expect(chain[1].name).toBe('groq');
  });

  it('fails over to the next provider in line if the primary provider throws an error', async () => {
    const groq = {
      name: 'groq',
      isConfigured: () => true,
      generateCompletion: vi.fn().mockRejectedValue(new Error('429 Rate Limit')),
    };
    const gemini = {
      name: 'gemini',
      isConfigured: () => true,
      generateCompletion: vi.fn().mockResolvedValue({
        content: 'Fallback response',
        provider: 'gemini',
        model: 'gemini-2.5-flash',
      }),
    };
    const openRouter = { name: 'openrouter', isConfigured: () => false, generateCompletion: vi.fn() };
    const fallback = { name: 'deterministic-fallback', isConfigured: () => true, generateCompletion: vi.fn() };

    const router = new AiRouterService(
      gemini as any,
      groq as any,
      openRouter as any,
      fallback as any,
    );

    const res = await router.execute(AiUseCase.INTERVIEW_CHAT, [
      { role: 'user', content: 'Design WhatsApp' },
    ]);

    expect(res.provider).toBe('gemini');
    expect(res.content).toBe('Fallback response');
  });
});
