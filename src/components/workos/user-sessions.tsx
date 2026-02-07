'use client';

import { UserSessions as WorkOSUserSessions } from '@workos-inc/widgets';

interface UserSessionsWidgetProps {
  /** Auth token from getWidgetToken server action */
  authToken: string;
  /** Current session ID (optional, shows which session is current) */
  currentSessionId?: string;
}

/**
 * User Sessions widget.
 * Allows users to view and manage their active sessions.
 * 
 * Usage:
 * ```tsx
 * const token = await getWidgetToken({ scopes: ['widgets:users-table:manage'] });
 * <UserSessionsWidget authToken={token} currentSessionId={session?.id} />
 * ```
 */
export function UserSessionsWidget({ authToken, currentSessionId }: UserSessionsWidgetProps) {
  // WorkOS UserSessions widget may require currentSessionId
  // If not provided, the widget may not highlight the current session
  return (
    <WorkOSUserSessions 
      authToken={authToken} 
      currentSessionId={currentSessionId ?? 'unknown'}
    />
  );
}
