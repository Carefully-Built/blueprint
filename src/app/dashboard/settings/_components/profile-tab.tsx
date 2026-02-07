'use client';

import { UserProfileWidget } from '@/components/workos/user-profile';
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
        <UserProfileWidget authToken={authToken} />
      </CardContent>
    </Card>
  );
}
