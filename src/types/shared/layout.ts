import type { ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
}

export interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: ReactNode;
}
