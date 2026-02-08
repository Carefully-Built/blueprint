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
 * Fetches a fresh widget token from the server (1-hour expiry)
 * Used by Profile, Security widgets
 */
async function fetchWidgetToken(): Promise<string> {
  const response = await fetch('/api/auth/token?type=widget');
  if (!response.ok) {
    throw new Error('Failed to fetch widget token');
  }
  const data = await response.json() as { token: string };
  return data.token;
}

/**
 * Fetches a fresh access token from the server (5-min expiry)
 * Used by UserSessions widget which requires access tokens
 */
async function fetchAccessToken(): Promise<string> {
  const response = await fetch('/api/auth/token?type=access');
  if (!response.ok) {
    throw new Error('Failed to fetch access token');
  }
  const data = await response.json() as { token: string };
  return data.token;
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
            <UserProfile authToken={fetchWidgetToken} />
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
            <UserSecurity authToken={fetchWidgetToken} />
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
