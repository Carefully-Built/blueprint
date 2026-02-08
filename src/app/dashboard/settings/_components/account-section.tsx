'use client';

import {
  UserProfile,
  UserSecurity,
  UserSessions,
  WorkOsWidgets,
} from '@workos-inc/widgets';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, Suspense } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AccountSectionProps {
  authToken: string;
  sessionId: string | null;
}

function WidgetSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

export function AccountSection({ authToken, sessionId }: AccountSectionProps): React.ReactElement {
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
            <Suspense fallback={<WidgetSkeleton />}>
              <UserProfile authToken={authToken} />
            </Suspense>
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
            <Suspense fallback={<WidgetSkeleton />}>
              <UserSecurity authToken={authToken} />
            </Suspense>
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
            <Suspense fallback={<WidgetSkeleton />}>
              {sessionId ? (
                <UserSessions authToken={authToken} currentSessionId={sessionId} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Unable to load sessions. Please try refreshing the page.
                </p>
              )}
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </WorkOsWidgets>
  );
}
