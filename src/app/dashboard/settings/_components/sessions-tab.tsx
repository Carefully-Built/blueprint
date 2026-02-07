'use client';

import { UserSessionsWidget } from '@/components/workos/user-sessions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SessionsTabProps {
  authToken: string;
}

export function SessionsTab({ authToken }: SessionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          View and manage your active sessions across devices.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserSessionsWidget authToken={authToken} />
      </CardContent>
    </Card>
  );
}
