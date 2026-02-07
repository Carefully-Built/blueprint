'use client';

import { useMutation } from 'convex/react';
import { useEffect, useState } from 'react';

import { api } from '@/../convex/_generated/api';

interface WorkOSUser {
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
export function useSyncUser() {
  const [user, setUser] = useState<WorkOSUser | null>(null);
  const [loading, setLoading] = useState(true);
  const syncUser = useMutation(api.functions.users.syncFromWorkOS);

  useEffect(() => {
    // Fetch user from the server
    fetch('/api/auth/user')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user) {
      // Sync user data to Convex
      syncUser({
        workosId: user.id,
        email: user.email,
        name:
          `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.profilePictureUrl,
        organizationId: user.organizationId,
        role: 'member', // Default role, adjust based on your logic
      }).catch((error) => {
        console.error('Failed to sync user with Convex:', error);
      });
    }
  }, [user, syncUser]);

  return { user, loading };
}
