'use client';

import { UserProfile } from '@workos-inc/widgets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileTabProps {
  authToken: string;
}

export function ProfileTab({ authToken }: ProfileTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Manage your personal information and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserProfile authToken={authToken} />
      </CardContent>
    </Card>
  );
}
