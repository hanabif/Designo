import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import { PrismaService } from '../../database/prisma.service.js';

/**
 * Verifies Clerk session tokens (Bearer) and resolves the local Prisma user
 * by `clerkId`. On success it populates `req.user` with the SAME shape the
 * legacy Passport JWT strategy produced, with `sub` kept as the Prisma user
 * id — so `@CurrentUser()` consumers and every downstream service (interviews,
 * diagrams, notifications, roles…) work unchanged.
 */
@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly secretKey?: string;

  constructor(
    private readonly prisma: PrismaService,
    configService: ConfigService,
  ) {
    this.secretKey = configService.get<string>('clerk.secretKey');
  }

  isConfigured(): boolean {
    return Boolean(this.secretKey);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; user?: unknown }>();
    const header = request.headers['authorization'] ?? '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }
    if (!this.secretKey) {
      throw new UnauthorizedException('Clerk auth is enabled but CLERK_SECRET_KEY is not configured');
    }

    let payload: { sub?: unknown };
    try {
      payload = (await verifyToken(token, {
        secretKey: this.secretKey,
        // Tolerate modest clock skew between this machine and Clerk's
        // (dev machines/VMs often drift a few minutes and Clerk tokens carry
        // an nbf ~issue time; without this a slow local clock 401s every call).
        clockSkewInMs: 5 * 60 * 1000,
      })) as { sub?: unknown };
    } catch (error) {
      // Surface the verifier's actual reason (jose/Clerk messages contain no
      // secrets) — "Invalid Clerk session token" alone is undiagnosable.
      const reason = error instanceof Error ? error.message : String(error);
      throw new UnauthorizedException(`Invalid Clerk session token: ${reason}`);
    }

    const clerkId = typeof payload.sub === 'string' ? payload.sub : undefined;
    if (!clerkId) {
      throw new UnauthorizedException('Clerk session token has no subject');
    }

    const user = await this.prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      throw new UnauthorizedException('No Designo profile is linked to this Clerk account yet');
    }

    request.user = { sub: user.id, email: user.email, role: user.role };
    return true;
  }
}
