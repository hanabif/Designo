import React, { useEffect } from 'react';
import { ClerkProvider, SignIn, SignUp, UserButton, useAuth, useClerk, useUser } from '@clerk/react';
import { api, setApiTokenGetter } from '../services/api';
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

/** Wraps the app in ClerkProvider when configured; a no-op otherwise. */
export const AppClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isClerkEnabled) return <>{children}</>;
  return (
    <ClerkProvider publishableKey={publishableKey} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
};

/** Sign out registered for the Navbar/App logout handlers (Clerk mode only). */
let clerkSignOut: (() => Promise<void>) | null = null;
export const clerkSignOutOnce = () => void clerkSignOut?.();

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
    if (isSignedIn) onSignedIn?.();
  }, [isSignedIn, onSignedIn]);
  return mode === 'signup' ? (
    <SignUp forceRedirectUrl="/" fallbackRedirectUrl="/" />
  ) : (
    <SignIn forceRedirectUrl="/" fallbackRedirectUrl="/" />
  );
};

/** The managed avatar menu (replaces the legacy dropdown in Clerk mode). */
export const ClerkUserButton: React.FC = () => <UserButton appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />;
