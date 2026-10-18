import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { ClerkProvider, SignIn, SignUp, UserButton, useAuth, useClerk, useUser } from '@clerk/react';
import { api, setApiTokenGetter, removeAuthToken } from '../services/api';
import type { User } from '../types';

/**
 * Clerk integration for the Designo SPA (migration phase 4).
 *
 * The whole layer is opt-in at build time: without VITE_CLERK_PUBLISHABLE_KEY
 * `isClerkEnabled` is false, `AppClerkProvider` renders children untouched and
 * the app keeps using the legacy custom auth modal + localStorage JWTs. With a
 * key, Clerk owns sessions and `api.ts` pulls short-lived session tokens from
 * `getToken()` instead.
 */

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
export const isClerkEnabled = Boolean(publishableKey);

// ── Session status (safe to consume anywhere, Clerk on or off) ─────────────
export interface ClerkStatus {
  /** True when Clerk is configured for this build. */
  enabled: boolean;
  /** True while Clerk is still resolving the initial session. */
  loading: boolean;
  /** True when a valid (non-expired) session exists. */
  signedIn: boolean;
}

const clerkStatusCtx = createContext<ClerkStatus>({ enabled: false, loading: false, signedIn: false });
export const useClerkStatus = () => useContext(clerkStatusCtx);

/**
 * "This browser has had a Clerk session before" marker. A missing/expired
 * session with this flag set = the user was logged out (expired), so we can
 * prompt for login immediately instead of showing the marketing landing.
 */
const SESSION_SEEN_KEY = 'designo_clerk_session_seen';
export const hadClerkSession = () => {
  try {
    return localStorage.getItem(SESSION_SEEN_KEY) === '1';
  } catch {
    return false;
  }
};

const StatusBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const prevSignedIn = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (isSignedIn) {
        localStorage.setItem(SESSION_SEEN_KEY, '1');
      } else if (prevSignedIn.current === true) {
        // Explicit sign-out in this tab — don't treat future visits as expiry.
        localStorage.removeItem(SESSION_SEEN_KEY);
      }
    } catch {
      // Storage unavailable — expiry detection degrades to "never seen".
    }
    prevSignedIn.current = isSignedIn;
  }, [isLoaded, isSignedIn]);

  const value = useMemo<ClerkStatus>(
    () => ({ enabled: true, loading: !isLoaded, signedIn: Boolean(isSignedIn) }),
    [isLoaded, isSignedIn],
  );
  return <clerkStatusCtx.Provider value={value}>{children}</clerkStatusCtx.Provider>;
};

/** Wraps the app in ClerkProvider when configured; a no-op otherwise. */
export const AppClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isClerkEnabled) return <>{children}</>;
  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      <StatusBridge>{children}</StatusBridge>
    </ClerkProvider>
  );
};

/** Sign out registered for the Navbar/App logout handlers (Clerk mode only). */
let clerkSignOut: (() => Promise<void>) | null = null;
/** Resolves once Clerk's sign-out has fully completed (no-op when disabled). */
export const clerkSignOutOnce = () => clerkSignOut?.() ?? Promise.resolve();

const mapClerkUserToAppUser = (u: { id: string; fullName?: string | null; firstName?: string | null; lastName?: string | null; primaryEmailAddress?: { emailAddress: string } | null; emailAddresses?: Array<{ emailAddress: string }> }): User => {
  const fullName = u.fullName || [u.firstName, u.lastName].filter(Boolean).join(' ');
  const email = u.primaryEmailAddress?.emailAddress ?? u.emailAddresses?.[0]?.emailAddress ?? '';
  return {
    id: u.id,
    fullName: fullName || email.split('@')[0] || 'Engineer',
    name: fullName || undefined,
    email,
    role: 'FREE',
    profile: {},
  } as User;
};

const ClerkAuthBridge: React.FC = () => {
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  // Every API call now authenticates with the live Clerk session token.
  useEffect(() => {
    setApiTokenGetter(() => getToken());
    // Purge any pre-migration localStorage tokens so they can never be sent
    // alongside (or instead of) the Clerk session token.
    removeAuthToken();
  }, [getToken]);

  useEffect(() => {
    clerkSignOut = () => signOut();
    return () => {
      clerkSignOut = null;
    };
  }, [signOut]);

  return null;
};

/** Internal: subscribes App-level state to the Clerk session (Clerk mode only). */
export const ClerkSessionSync: React.FC<{ onUser: (user: User | null) => void }> = ({ onUser }) => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const clerkUserId = user?.id;

  // Load the Designo profile (Prisma row) once the Clerk session exists; if
  // the webhook hasn't linked a row yet, fall back to the Clerk profile so
  // the shell still renders (API calls will surface link errors).
  useEffect(() => {
    if (!isSignedIn || !clerkUserId) {
      onUser(null);
      return;
    }
    let cancelled = false;
    api
      .getMe()
      .then((me) => {
        if (cancelled) return;
        onUser({
          ...me,
          profile: {
            experienceLevel: me.experienceLevel,
            position: me.currentPosition,
            years: me.yearsOfExperience,
            targetCompany: me.targetCompany,
            targetLevel: me.targetLevel,
          },
        });
      })
      .catch(() => {
        if (!cancelled && user) onUser(mapClerkUserToAppUser(user));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, clerkUserId, onUser]);

  return <ClerkAuthBridge />;
};

/** Renders Clerk <SignIn>/<SignUp> inside the existing Designo modal chrome. */
export const ClerkAuthForm: React.FC<{ mode: 'signup' | 'login'; onSignedIn?: () => void }> = ({ mode, onSignedIn }) => {
  const { isSignedIn } = useAuth();
  useEffect(() => {
    if (!isSignedIn) return;
    // Strip Clerk's flow hash (e.g. #/factor-one) so the app URL stays clean.
    if (window.location.hash.startsWith('#/')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    onSignedIn?.();
  }, [isSignedIn, onSignedIn]);
  return mode === 'signup' ? (
    <SignUp routing="hash" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard" />
  ) : (
    <SignIn routing="hash" forceRedirectUrl="/dashboard" fallbackRedirectUrl="/dashboard" />
  );
};

/** The managed avatar menu (replaces the legacy dropdown in Clerk mode). */
export const ClerkUserButton: React.FC = () => <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />;
