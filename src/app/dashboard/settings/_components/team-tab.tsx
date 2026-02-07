'use client';

import { UsersManagement, WorkOsWidgets } from '@/components/workos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamTabProps {
  authToken: string;
}

export function TeamTab({ authToken }: TeamTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite and manage your team
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkOsWidgets>
          <UsersManagement authToken={authToken} />
        </WorkOsWidgets>
      </CardContent>
    </Card>
  );
}
