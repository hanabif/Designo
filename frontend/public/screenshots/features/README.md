# Feature screenshots

Drop real app screenshots here (PNG) to replace the built-in mock screens on the
landing page's "Everything included" tabbed showcase. Files are picked up
automatically — no code changes needed.

Expected files (16:10-ish works best, e.g. 1600×1000; the top of the page is
kept visible via `object-top`):

- `live-ai-interview.png`   → route `/interview`
- `question-bank.png`       → route `/questions`
- `evaluation-reports.png`  → route `/report`
- `diagram-studio.png`      → route `/diagrams`
- `adaptive-roadmap.png`    → route `/roadmap`

If a file is missing, the tab silently falls back to its palette-matched SVG
mock (see `src/components/features/FeatureMocks.tsx`).
