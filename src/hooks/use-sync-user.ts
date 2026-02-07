'use client';

import { api } from '@convex/_generated/api';
import { useMutation } from 'convex/react';
import { useEffect } from 'react';

export interface WorkOSUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  organizationId?: string;
}

/**
 * Hook to automatically sync WorkOS user with Convex database
 * Call this in your root layout or dashboard layout
 */
export function useSyncUser(user: WorkOSUser | null): { user: WorkOSUser | null } {
  const syncUser = useMutation(api.functions.users.mutations.syncFromWorkOS);

  useEffect(() => {
    if (user) {
      // Sync user data to Convex
      syncUser({
        workosId: user.id,
        email: user.email,
        name:
          `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.profilePictureUrl,
        organizationId: user.organizationId,
        role: 'member',
      }).catch((error: unknown) => {
        console.error('Failed to sync user with Convex:', error);
      });
    }
  }, [user, syncUser]);

  return { user };
}
