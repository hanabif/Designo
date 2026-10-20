# Clerk auth migration — runbook

Designo now supports **Clerk authentication alongside the existing custom JWT
auth**. Nothing was removed: `AUTH_PROVIDER` selects the provider, and the
legacy `/auth/register|login|refresh|logout` endpoints, Passport JWT strategy,
`RefreshToken` model, and the custom auth modal all remain as the permanent
fallback/rollback path.

## What changed

**Database**
- `users.clerkId` (nullable, unique) links a Prisma user to a Clerk user.
- `users.passwordHash` is now nullable (Clerk-managed users have no local hash).
- `users.id` (cuid) remains the foreign key everywhere — no data was re-keyed.
- Migration: `prisma/migrations/20261015120000_add_clerk_id/` — apply with
  `npx prisma migrate deploy` when the database is reachable.

**Backend (NestJS)**
- `AppAuthGuard` (`src/common/guards/app-auth.guard.ts`) — provider switch:
  - `AUTH_PROVIDER=local` (default): legacy Passport JWT, unchanged behavior.
  - `AUTH_PROVIDER=clerk`: verifies Clerk session tokens (JWKS via
    `@clerk/backend` `verifyToken`), resolves the Prisma user by `clerkId`,
    and sets `req.user = { sub, email, role }` with `sub` = Prisma user id —
    so every controller, `@CurrentUser()` consumer, and the `RolesGuard` work
    unchanged. All 10 guarded controllers now use it.
- `POST /clerk-webhook` — signed user sync (created/updated/deleted). Requires
  `CLERK_WEBHOOK_SECRET`; returns 503 until configured. On delete it only
  unlinks (`clerkId=null`) — local data is preserved.
- `backend/scripts/import-users-to-clerk.mjs` — imports existing users into
  Clerk with their argon2id digests (`--dry-run` supported). Users whose hash
  Clerk rejects are written to `clerk-import-failures.csv` for a password
  reset instead — nobody is locked out.

**Frontend (Vite + React)**
- `src/lib/clerk.tsx` — opt-in layer keyed on `VITE_CLERK_PUBLISHABLE_KEY`:
  without the key the app is byte-for-byte the legacy behavior; with it,
  `ClerkProvider` wraps the app, `AuthModal` renders Clerk `<SignIn>/<SignUp>`
  inside the Designo modal, the Navbar shows `<UserButton />`, and logout uses
  Clerk `signOut`.
- `services/api.ts` — `setApiTokenGetter()` lets Clerk supply live session
  tokens to every request (replacing localStorage tokens + refresh rotation).

## Rollout

1. **Provision** — create a Clerk application (dashboard.clerk.com), then from
   the repo root: `npx clerk auth login`, `npx clerk link`, `npx clerk env pull`.
   Copy `backend/.env.clerk.example` / `frontend/.env.clerk.example` values in.
2. **Database** — `cd backend && npx prisma migrate deploy`.
3. **Import users** — `node scripts/import-users-to-clerk.mjs --dry-run`, then
   for real; check `clerk-import-failures.csv` if non-empty and send those
   users a Clerk password-reset email.
4. **Webhook** — in the Clerk dashboard add a webhook for `user.created`,
   `user.updated`, `user.deleted` pointing at
   `https://<api-host>/clerk-webhook`, and set `CLERK_WEBHOOK_SECRET`.
5. **Cutover** — deploy backend with `AUTH_PROVIDER=clerk` and the frontend
   with `VITE_CLERK_PUBLISHABLE_KEY`. Existing users sign into Clerk once with
   their existing password and keep all their history.
6. **Rollback at any time** — set `AUTH_PROVIDER=local` (backend) and remove
   the frontend key; the legacy path is intact.

## Before production

- Claim the app (`npx clerk@latest auth login`) and configure production keys
  (`npx clerk@latest deploy`). Unclaimed apps and temporary keys are not
  production-ready.
- Sign-up/sign-in options (email/phone/username, social providers) are managed
  in the Clerk Dashboard or via `npx clerk config pull|patch`.
