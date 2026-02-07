'use client';

import { WorkOsWidgets } from '@workos-inc/widgets';
import '@workos-inc/widgets/styles.css';

import type { ReactNode } from 'react';

interface WorkOSWidgetsProviderProps {
  children: ReactNode;
}

/**
 * Provider for WorkOS Widgets. Wrap your app or dashboard with this.
 * Must be a client component.
 */
export function WorkOSWidgetsProvider({ children }: WorkOSWidgetsProviderProps) {
  return <WorkOsWidgets>{children}</WorkOsWidgets>;
}
