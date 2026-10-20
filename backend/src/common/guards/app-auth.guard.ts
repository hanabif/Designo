import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Observable } from 'rxjs';
import { PrismaService } from '../../database/prisma.service.js';
import { ClerkAuthGuard } from './clerk-auth.guard.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

/**
 * Provider-aware auth facade (Clerk migration switch).
 *
 * - AUTH_PROVIDER=local  (default) → the legacy Passport JWT strategy.
 * - AUTH_PROVIDER=clerk            → Clerk session tokens verified against
 *                                    Clerk's JWKS, user resolved by clerkId.
 *
 * The legacy path is kept permanently so the switch is reversible; nothing
 * about the request contract changes between the two (`req.user` keeps the
 * `{ sub, email, role }` shape with `sub` = Prisma user id).
 */
@Injectable()
export class AppAuthGuard implements CanActivate {
  private readonly provider: string;
  private readonly localGuard = new JwtAuthGuard();
  private readonly clerkGuard: ClerkAuthGuard;

  constructor(prisma: PrismaService, configService: ConfigService) {
    this.provider = configService.get<string>('auth.provider') ?? 'local';
    this.clerkGuard = new ClerkAuthGuard(prisma, configService);
  }

  canActivate(context: ExecutionContext): Observable<boolean> | Promise<boolean> | boolean {
    if (this.provider === 'clerk') {
      return this.clerkGuard.canActivate(context);
    }
    return this.localGuard.canActivate(context);
  }
}
