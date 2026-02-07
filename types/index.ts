import type { ReactNode } from 'react';

// ============================================================
// LAYOUT TYPES
// ============================================================

export interface LayoutProps {
  children: ReactNode;
}

export interface PageProps {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ============================================================
// NAVIGATION TYPES
// ============================================================

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  badge?: string;
  children?: NavItem[];
}

export interface SidebarConfig {
  main: NavItem[];
  secondary?: NavItem[];
}

// ============================================================
// API RESPONSE TYPES
// ============================================================

export interface ApiResponse<T> {
  data: T;
  success: true;
}

export interface ApiError {
  error: string;
  code: string;
  success: false;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// ============================================================
// COMPONENT PROP TYPES
// ============================================================

export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: ReactNode;
}

export interface DataTableColumn<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
}
