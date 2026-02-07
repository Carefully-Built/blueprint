'use client';

import { useEffect, useState } from 'react';
import { UsersManagement, WorkOsWidgets } from '@workos-inc/widgets';
import '@workos-inc/widgets/styles.css';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamTabProps {
  organizationId: string;
}

export function TeamTab({ organizationId }: TeamTabProps) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/widgets/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            organizationId,
            scopes: ['widgets:users-table:manage'] 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get widget token');
        }

        const data = await response.json();
        setToken(data.token);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [organizationId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>Loading team management...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Unable to load team management. Make sure WorkOS roles are configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {error || 'Please configure roles in the WorkOS Dashboard to enable team management.'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>
          Invite and manage your team members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <WorkOsWidgets>
          <UsersManagement authToken={token} />
        </WorkOsWidgets>
      </CardContent>
    </Card>
  );
}
