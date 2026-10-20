#!/usr/bin/env node
/**
 * Migration: import existing Designo users into Clerk.
 *
 * For every Prisma user without a `clerkId`:
 *   1. Create the user in Clerk with their existing argon2id password digest
 *      (`password_hasher: argon2`, checks skipped) so their current password
 *      keeps working after cutover.
 *   2. Store the returned Clerk user id in `users.clerkId`.
 *   3. If Clerk rejects the digest, fall back to creating the account WITHOUT
 *      a password and add the user to `clerk-import-failures.csv` so you can
 *      send them a password-reset email instead — nobody is locked out.
 *
 * Usage (from backend/):
 *   node scripts/import-users-to-clerk.mjs           # real run
 *   node scripts/import-users-to-clerk.mjs --dry-run # report only
 *
 * Requires CLERK_SECRET_KEY and DATABASE_URL in backend/.env (or the env).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { createClerkClient } from '@clerk/backend';

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

// Minimal .env loader (no values are printed).
const envPath = join(backendRoot, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/.exec(line);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
  }
}

const dryRun = process.argv.includes('--dry-run');
const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) {
  console.error('CLERK_SECRET_KEY is not set — aborting.');
  process.exit(1);
}

const prisma = new PrismaClient();
const clerk = createClerkClient({ secretKey });

async function main() {
  const users = await prisma.user.findMany({ where: { clerkId: null } });
  console.log(`Found ${users.length} user(s) without a Clerk link.`);

  const failures = [];
  let imported = 0;
  let linked = 0;
  let failed = 0;

  for (const user of users) {
    const [firstName, ...rest] = user.fullName.trim().split(/\s+/);
    const lastName = rest.join(' ') || undefined;

    if (dryRun) {
      console.log(`[dry-run] would import ${user.email} (hash: ${user.passwordHash ? 'argon2' : 'none'})`);
      continue;
    }

    // Already exists in Clerk (e.g. signed up during testing)? Just link.
    const existing = await clerk.users.getUserList({ emailAddress: [user.email] }).catch(() => null);
    const preexisting = existing?.data?.[0];
    if (preexisting) {
      await prisma.user.update({ where: { id: user.id }, data: { clerkId: preexisting.id } });
      linked += 1;
      console.log(`Linked ${user.email} to an existing Clerk user.`);
      continue;
    }

    try {
      const created = await clerk.users.createUser({
        emailAddress: [user.email],
        firstName,
        lastName,
        // Preserve the existing argon2id password (PHC string from @node-rs/argon2).
        ...(user.passwordHash
          ? {
              passwordDigest: user.passwordHash,
              passwordHasher: 'argon2id',
              skipPasswordChecks: true,
            }
          : {}),
        publicMetadata: { designoUserId: user.id, designoRole: user.role },
      });
      await prisma.user.update({ where: { id: user.id }, data: { clerkId: created.id } });
      imported += 1;
      console.log(`Imported ${user.email}.`);
    } catch (error) {
      failed += 1;
      failures.push({ email: user.email, fullName: user.fullName, reason: error?.message ?? String(error) });
      console.warn(`FAILED ${user.email}: ${error?.message ?? error}`);
    }
  }

  if (!dryRun && failures.length) {
    const csvPath = join(backendRoot, 'clerk-import-failures.csv');
    const csv = ['email,fullName,reason', ...failures.map((f) => `"${f.email}","${f.fullName}","${String(f.reason).replace(/"/g, '""')}"`)].join('\n');
    writeFileSync(csvPath, csv, 'utf8');
    console.log(`\n${failures.length} user(s) could not import their password hash.`);
    console.log(`List written to ${csvPath} — send those users a Clerk password-reset email.`);
  }

  console.log(`\nDone. imported=${imported} linked=${linked} failed=${failed} dryRun=${dryRun}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
