'use client';

import { ConvexClientProvider } from './convex-provider';
import { QueryProvider } from './query-provider';

import type { ReactNode } from 'react';

export { OrganizationProvider, useOrganization } from './organization-provider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps): React.ReactElement => (
  <QueryProvider>
    <ConvexClientProvider>{children}</ConvexClientProvider>
  </QueryProvider>
);
