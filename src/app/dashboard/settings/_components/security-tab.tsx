'use client';

import { UserSecurity, WorkOsWidgets } from '@/components/workos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SecurityTabProps {
  authToken: string;
}

export function SecurityTab({ authToken }: SecurityTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your password, two-factor authentication, and security settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkOsWidgets>
          <UserSecurity authToken={authToken} />
        </WorkOsWidgets>
      </CardContent>
    </Card>
  );
}
