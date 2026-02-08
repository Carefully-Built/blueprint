'use client';

import { UserSessions } from '@workos-inc/widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SessionsTabProps {
  authToken: string;
  sessionId?: string;
}

export function SessionsTab({ authToken, sessionId }: SessionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          View and manage your active sessions across devices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserSessions authToken={authToken} currentSessionId={sessionId ?? ''} />
      </CardContent>
    </Card>
  );
}
