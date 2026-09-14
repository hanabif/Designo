# Designo API — Phase 2

All endpoints below require a JWT bearer token.

## Evaluation

`POST /evaluations/generate`

```json
{ "interviewId": "cm..." }
```

Only completed interviews can be evaluated. The response is an evaluation report with a `PENDING`, `PROCESSING`, `COMPLETED`, or `FAILED` status. Repeating the request for a completed report returns the existing report.

`GET /evaluations/:id` returns an evaluation report owned by the authenticated user.

## Analytics

`GET /analytics/dashboard` returns interview totals, score summaries, category averages, and weak/strong areas.

`GET /analytics/progress` returns score history by completed, evaluated interview.

## Running Phase 2 locally

1. Start PostgreSQL and Redis with `docker compose up -d` from the repository root.
2. Apply migrations with `npx prisma migrate dev` from `backend`.
3. Set `OPENAI_API_KEY` to receive model-based reports. Without it, the worker produces a clearly marked deterministic development report.
