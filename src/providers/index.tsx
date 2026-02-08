'use client';

import { WorkOsWidgets } from '@workos-inc/widgets';

import { ConvexClientProvider } from './convex-provider';
import { QueryProvider } from './query-provider';

import type { ReactNode } from 'react';

export { OrganizationProvider, useOrganization } from './organization-provider';
export { UserProvider, useUser } from './user-provider';
export type { UserData } from './user-provider';

interface ProvidersProps {
  readonly children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps): React.ReactElement => (
  <QueryProvider>
    <WorkOsWidgets theme={{ accentColor: 'teal', radius: 'medium' }}>
      <ConvexClientProvider>{children}</ConvexClientProvider>
    </WorkOsWidgets>
  </QueryProvider>
);
