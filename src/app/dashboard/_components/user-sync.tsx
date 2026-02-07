'use client';

import { useSyncUser } from '@/hooks/use-sync-user';

/**
 * Client component that syncs WorkOS user with Convex
 * Include this in the dashboard layout to ensure user sync
 */
export function UserSync() {
  useSyncUser();
  return null;
}
