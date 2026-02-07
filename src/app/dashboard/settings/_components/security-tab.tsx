'use client';

import { UserSecurityWidget } from '@/components/workos/user-security';
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
        <UserSecurityWidget authToken={authToken} />
      </CardContent>
    </Card>
  );
}
