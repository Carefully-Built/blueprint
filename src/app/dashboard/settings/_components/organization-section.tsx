'use client';

import { UsersManagement, WorkOsWidgets } from '@/components/workos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationCard } from './organization-card';

interface OrganizationSectionProps {
  readonly organization: {
    readonly id: string;
    readonly name: string;
    readonly role: string;
  };
  readonly teamAuthToken: string | null;
}

export function OrganizationSection({ 
  organization, 
  teamAuthToken 
}: OrganizationSectionProps): React.ReactElement {
  return (
    <div className="space-y-6">
      <OrganizationCard organization={organization} />

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Invite and manage your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamAuthToken ? (
            <WorkOsWidgets theme={{ accentColor: 'teal', radius: 'medium' }}>
              <UsersManagement authToken={teamAuthToken} />
            </WorkOsWidgets>
          ) : (
            <p className="text-sm text-muted-foreground">
              Unable to load team management. Please contact your administrator.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
