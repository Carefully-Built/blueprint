'use client';

import { UserSecurity } from '@workos-inc/widgets';
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
        <UserSecurity authToken={authToken} />
      </CardContent>
    </Card>
  );
}
