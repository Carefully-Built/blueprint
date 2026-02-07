'use client';

import { UserProfile as WorkOSUserProfile } from '@workos-inc/widgets';

interface UserProfileWidgetProps {
  /** Auth token from getWidgetToken server action */
  authToken: string;
}

/**
 * User Profile widget.
 * Displays and allows editing of user profile information.
 * 
 * Usage:
 * ```tsx
 * const token = await getWidgetToken({ scopes: ['widgets:users-table:read'] });
 * <UserProfileWidget authToken={token} />
 * ```
 */
export function UserProfileWidget({ authToken }: UserProfileWidgetProps) {
  return <WorkOSUserProfile authToken={authToken} />;
}
