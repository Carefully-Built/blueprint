import { api } from '@convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';

import type { Id } from '@convex/_generated/dataModel';

// Server-side Convex client for use in Server Actions and API routes
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export const convexServer = convexUrl ? new ConvexHttpClient(convexUrl) : null;

interface SyncUserParams {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePictureUrl?: string | null;
}

/**
 * Sync a WorkOS user to Convex database
 * Call this during sign-in/sign-up to ensure user exists in Convex
 */
export async function syncUserToConvex(user: SyncUserParams): Promise<Id<'users'> | null> {
  if (!convexServer) {
    console.warn('Convex not configured - skipping user sync');
    return null;
  }

  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || undefined;

  const userId = await convexServer.mutation(api.functions.users.mutations.syncFromWorkOS, {
    workosId: user.id,
    email: user.email,
    name,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    imageUrl: user.profilePictureUrl ?? undefined,
    organizationId: 'default',
    role: 'member',
  });

  return userId;
}
