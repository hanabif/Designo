import { Controller, Headers, HttpCode, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyWebhook } from '@clerk/backend/webhooks';
import type { WebhookEvent } from '@clerk/backend/webhooks';
import type { Request, Response } from 'express';
import { PrismaService } from '../../database/prisma.service.js';

type ExpressRawRequest = RawBodyRequest<Request>;

/**
 * Clerk user sync webhook (migration phase 3).
 *
 * Keeps the local Prisma `users` table in step with Clerk without ever
 * re-keying data: `users.id` (cuid) stays the foreign key everywhere, and
 * only `clerkId` / profile fields are touched.
 *
 * - user.created → link by email if a legacy row exists, otherwise create a row
 * - user.updated → sync email / name / emailVerified
 * - user.deleted → unlink (clerkId cleared, local data preserved)
 *
 * Requires CLERK_WEBHOOK_SECRET; returns 503 until it is configured so the
 * Clerk dashboard shows the endpoint as not-yet-ready instead of silently
 * accepting unverifiable payloads.
 */
@Controller('clerk-webhook')
export class ClerkWebhookController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private primaryEmail(data: { email_addresses?: Array<{ id: string; email_address: string }>; primary_email_address_id?: string | null }): string | undefined {
    const addresses = data.email_addresses ?? [];
    if (data.primary_email_address_id) {
      const primary = addresses.find((a) => a.id === data.primary_email_address_id);
      if (primary) return primary.email_address.toLowerCase();
    }
    return addresses[0]?.email_address.toLowerCase();
  }

  @Post()
  @HttpCode(200)
  async handle(
    @Req() req: ExpressRawRequest,
    @Res() res: Response,
    @Headers('content-type') contentType: string | undefined,
    @Headers('svix-id') _svixId: string | undefined,
  ) {
    const signingSecret = this.configService.get<string>('clerk.webhookSecret');
    if (!signingSecret) {
      return res.status(503).json({ message: 'Clerk webhooks are not configured (CLERK_WEBHOOK_SECRET missing)' });
    }
    if (!req.rawBody) {
      return res.status(400).json({ message: 'Raw request body is required for webhook verification' });
    }

    // verifyWebhook consumes a Fetch Request; rebuild one from the raw body.
    const request = new Request('http://localhost/clerk-webhook', {
      method: 'POST',
      headers: {
        'content-type': contentType ?? 'application/json',
        'svix-id': req.headers['svix-id'] as string ?? '',
        'svix-timestamp': req.headers['svix-timestamp'] as string ?? '',
        'svix-signature': req.headers['svix-signature'] as string ?? '',
      },
      body: new Uint8Array(req.rawBody),
    });

    let event: WebhookEvent;
    try {
      event = await verifyWebhook(request, { signingSecret });
    } catch {
      return res.status(400).json({ message: 'Webhook signature verification failed' });
    }

    const data = event.data as typeof event.data & {
      id: string;
      email_addresses?: Array<{ id: string; email_address: string }>;
      primary_email_address_id?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      email_verified?: boolean;
    };
    const email = this.primaryEmail(data);

    switch (event.type) {
      case 'user.created': {
        if (!email) return res.status(400).json({ message: 'No email on event' });
        const existing = await this.prisma.user.findFirst({
          where: { OR: [{ clerkId: data.id }, { email }] },
        });
        if (existing) {
          await this.prisma.user.update({
            where: { id: existing.id },
            data: {
              clerkId: data.id,
              email,
              fullName: existing.fullName || [data.first_name, data.last_name].filter(Boolean).join(' ') || existing.email,
              emailVerified: data.email_verified ?? existing.emailVerified,
            },
          });
        } else {
          await this.prisma.user.create({
            data: {
              clerkId: data.id,
              email,
              fullName: [data.first_name, data.last_name].filter(Boolean).join(' ') || email.split('@')[0],
              emailVerified: data.email_verified ?? false,
              passwordHash: null,
            },
          });
        }
        break;
      }
      case 'user.updated': {
        await this.prisma.user.updateMany({
          where: { clerkId: data.id },
          data: {
            ...(email ? { email } : {}),
            ...([data.first_name, data.last_name].filter(Boolean).join(' ')
              ? { fullName: [data.first_name, data.last_name].filter(Boolean).join(' ') }
              : {}),
            ...(typeof data.email_verified === 'boolean' ? { emailVerified: data.email_verified } : {}),
          },
        });
        break;
      }
      case 'user.deleted': {
        // Unlink only — interviews, diagrams and notifications keep their
        // rows (they reference the immutable Prisma id, not Clerk).
        await this.prisma.user.updateMany({
          where: { clerkId: data.id },
          data: { clerkId: null },
        });
        break;
      }
    }

    return res.json({ received: true });
  }
}
