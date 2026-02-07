'use client';

import { UsersManagement as WorkOSUsersManagement } from '@workos-inc/widgets';

interface UsersManagementWidgetProps {
  /** Auth token from getWidgetToken server action */
  authToken: string;
}

/**
 * Users Management widget.
 * Allows organization admins to invite, remove, and manage team members.
 * 
 * Required scopes: widgets:users-table:manage
 * 
 * Usage:
 * ```tsx
 * const token = await getWidgetToken({ 
 *   organizationId: orgId,
 *   scopes: ['widgets:users-table:manage'] 
 * });
 * <UsersManagementWidget authToken={token} />
 * ```
 */
export function UsersManagementWidget({ authToken }: UsersManagementWidgetProps) {
  return <WorkOSUsersManagement authToken={authToken} />;
}
