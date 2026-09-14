export default () => ({
  port: parseInt(process.env.API_PORT ?? '3001', 10),
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
  ai: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY?.trim() ?? process.env.GOOGLE_API_KEY?.trim(),
      model: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash',
      baseUrl: process.env.GEMINI_BASE_URL ?? 'https://generativelanguage.googleapis.com/v1beta/openai/',
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY?.trim(),
      model: process.env.GROQ_MODEL ?? 'llama-3.1-8b-instant',
      baseUrl: process.env.GROQ_BASE_URL ?? 'https://api.groq.com/openai/v1',
    },
    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY?.trim() ?? process.env.OPENROUTE_API_KEY?.trim(),
      model: process.env.OPENROUTER_MODEL ?? 'meta-llama/llama-3.3-70b-instruct:free',
      baseUrl: process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1',
    },
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL ?? 'gpt-5.6-mini',
    },
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'change-me-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-me-refresh-secret',
    accessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '7d',
  },
});
