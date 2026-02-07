'use client';

import { UserSessions, WorkOsWidgets } from '@/components/workos';
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
        <WorkOsWidgets>
          <UserSessions authToken={authToken} currentSessionId="" />
        </WorkOsWidgets>
      </CardContent>
    </Card>
  );
}
