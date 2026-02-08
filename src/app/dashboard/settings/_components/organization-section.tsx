'use client';

import { useAccessToken } from '@workos-inc/authkit-nextjs';

import { UsersManagement, WorkOsWidgets } from '@/components/workos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrganizationCard } from './organization-card';

interface OrganizationSectionProps {
  organization: {
    id: string;
    name: string;
    role: string;
  };
}

export function OrganizationSection({ 
  organization, 
}: OrganizationSectionProps): React.ReactElement {
  const { getAccessToken, loading, error } = useAccessToken();

  return (
    <div className="space-y-6">
      {/* Organization Card */}
      <OrganizationCard organization={organization} />

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Invite and manage your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : error ? (
            <p className="text-sm text-destructive">
              Unable to load team management. Please try refreshing the page.
            </p>
          ) : (
            <WorkOsWidgets>
              <UsersManagement authToken={getAccessToken} />
            </WorkOsWidgets>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
