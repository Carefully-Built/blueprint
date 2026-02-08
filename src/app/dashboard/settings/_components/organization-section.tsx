'use client';

import { UsersManagement, WorkOsWidgets } from '@/components/workos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationCard } from './organization-card';

interface OrganizationSectionProps {
  organization: {
    id: string;
    name: string;
    role: string;
  };
  teamAuthToken: string | null;
}

export function OrganizationSection({ 
  organization, 
  teamAuthToken 
}: OrganizationSectionProps): React.ReactElement {
  return (
    <div className="space-y-6">
      {/* Organization Card */}
      <OrganizationCard organization={organization} />

      {/* Team Members */}
      {teamAuthToken && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Invite and manage your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkOsWidgets>
              <UsersManagement authToken={teamAuthToken} />
            </WorkOsWidgets>
          </CardContent>
        </Card>
      )}

      {!teamAuthToken && (
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Team management is not available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Unable to load team management. Please contact your administrator.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
