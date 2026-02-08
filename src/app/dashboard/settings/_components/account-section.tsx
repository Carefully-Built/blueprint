'use client';

import {
  UserProfile,
  UserSecurity,
  UserSessions,
  WorkOsWidgets,
} from '@workos-inc/widgets';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountSectionProps {
  authToken: string;
}

export function AccountSection({ authToken }: AccountSectionProps): React.ReactElement {
  const router = useRouter();

  const handleUserUpdate = useCallback((): void => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    window.addEventListener('user-updated', handleUserUpdate);
    return (): void => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, [handleUserUpdate]);

  // Dynamic token fetcher for UserSessions widget
  // This mode doesn't require currentSessionId
  const getAuthToken = useCallback(async (): Promise<string> => {
    return authToken;
  }, [authToken]);

  return (
    <WorkOsWidgets>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your personal information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="workos-widget-container">
            <UserProfile authToken={authToken} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and two-factor authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="workos-widget-container">
            <UserSecurity authToken={authToken} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              View and manage your active sessions across devices.
            </CardDescription>
          </CardHeader>
          <CardContent className="workos-widget-container">
            <UserSessions authToken={getAuthToken} />
          </CardContent>
        </Card>
      </div>
    </WorkOsWidgets>
  );
}
