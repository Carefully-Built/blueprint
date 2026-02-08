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

/**
 * Fetches a fresh access token from the server
 * This is called by WorkOS widgets when they need to make API requests
 */
async function fetchAccessToken(): Promise<string> {
  const response = await fetch('/api/auth/token');
  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }
  const data = await response.json() as { accessToken: string };
  return data.accessToken;
}

export function AccountSection(): React.ReactElement {
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
            <UserProfile authToken={fetchAccessToken} />
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
            <UserSecurity authToken={fetchAccessToken} />
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
            <UserSessions authToken={fetchAccessToken} />
          </CardContent>
        </Card>
      </div>
    </WorkOsWidgets>
  );
}
