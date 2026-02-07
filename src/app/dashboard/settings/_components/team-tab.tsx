'use client';

import { UsersManagementWidget } from '@/components/workos/users-management';
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
          Invite and manage team members in your organization.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsersManagementWidget authToken={authToken} />
      </CardContent>
    </Card>
  );
}
