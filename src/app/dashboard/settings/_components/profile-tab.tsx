'use client';

import { UserProfile, WorkOsWidgets } from '@/components/workos';
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
        <WorkOsWidgets>
          <UserProfile authToken={authToken} />
        </WorkOsWidgets>
      </CardContent>
    </Card>
  );
}
