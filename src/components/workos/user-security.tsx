'use client';

import { UserSecurity as WorkOSUserSecurity } from '@workos-inc/widgets';

interface UserSecurityWidgetProps {
  /** Auth token from getWidgetToken server action */
  authToken: string;
}

/**
 * User Security widget.
 * Allows users to manage their security settings (password, MFA, etc).
 * 
 * Usage:
 * ```tsx
 * const token = await getWidgetToken({ scopes: ['widgets:users-table:manage'] });
 * <UserSecurityWidget authToken={token} />
 * ```
 */
export function UserSecurityWidget({ authToken }: UserSecurityWidgetProps) {
  return <WorkOSUserSecurity authToken={authToken} />;
}
