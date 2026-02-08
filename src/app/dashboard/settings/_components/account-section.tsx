'use client';

import { useAccessToken } from '@workos-inc/authkit-nextjs/components';
import {
  UserProfile,
  UserSecurity,
  UserSessions,
  WorkOsWidgets,
} from '@workos-inc/widgets';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AccountSection(): React.ReactElement {
  const router = useRouter();
  const { getAccessToken, loading, error } = useAccessToken();

  // Wrapper that ensures token is defined (widgets require non-undefined)
  const getToken = async (): Promise<string> => {
    const token = await getAccessToken();
    if (!token) throw new Error('No access token available');
    return token;
  };

  // Set up listener for user updates
  const handleUserUpdate = useCallback((): void => {
    router.refresh();
  }, [router]);

  useEffect(() => {
    window.addEventListener('user-updated', handleUserUpdate);
    return (): void => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, [handleUserUpdate]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Error loading account settings. Please try refreshing the page.
      </div>
    );
  }

  return (
    <WorkOsWidgets>
      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your personal information and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfile authToken={getToken} />
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and two-factor authentication.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSecurity authToken={getToken} />
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              View and manage your active sessions across devices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserSessions authToken={getToken} />
          </CardContent>
        </Card>
      </div>
    </WorkOsWidgets>
  );
}
