'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useMemo } from 'react';

import type { ReactNode } from 'react';

interface ConvexClientProviderProps {
  children: ReactNode;
}

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps): React.ReactElement => {
  // eslint-disable-next-line @typescript-eslint/dot-notation
  const convexUrl = process.env['NEXT_PUBLIC_CONVEX_URL'];

  const client = useMemo(() => {
    if (!convexUrl) {
      return null;
    }
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  // If no Convex URL configured, render children without Convex provider
  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
};
