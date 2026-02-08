import type { ReactNode } from 'react';

export type ColumnAlign = 'left' | 'center' | 'right';

export interface Column<T> {
  /** Column header text */
  header: string;
  /** Key to access data (supports nested paths like 'user.name') */
  accessor?: keyof T | string;
  /** Column width */
  width?: string | number;
  /** Text alignment */
  align?: ColumnAlign;
  /** Custom render function */
  render?: (value: unknown, row: T) => ReactNode;
  /** Hide this column on mobile cards */
  hideOnMobile?: boolean;
}

export type ActionType = 'view' | 'edit' | 'delete';

export interface ActionHandlers<T> {
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export interface PaginationConfig {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
  /** Start index (0-indexed) */
  startIndex: number;
  /** End index (exclusive) */
  endIndex: number;
  /** Go to specific page */
  onPageChange: (page: number) => void;
}

export interface SmartTableProps<T> {
  /** Data array to display */
  data: T[];
  /** Column definitions */
  columns: Column<T>[];
  /** Loading state - shows skeletons */
  isLoading: boolean;
  /** Number of skeleton rows to show when loading */
  skeletonRows?: number;
  /** Actions to show (will render action buttons) */
  actions?: ActionType[];
  /** Action handlers */
  actionHandlers?: ActionHandlers<T>;
  /** Custom actions renderer (overrides actions prop) */
  renderActions?: (item: T) => ReactNode;
  /** Message when no data */
  noDataMessage?: string;
  /** Function to get unique key for each row */
  getRowKey?: (item: T) => string | number;
  /** Make rows clickable */
  onRowClick?: (item: T) => void;
  /** Custom mobile card renderer */
  renderMobileCard?: (item: T) => ReactNode;
  /** Enable pagination */
  pagination?: PaginationConfig;
  /** Enable sticky header with scrollable body */
  stickyHeader?: boolean;
  /** Max height for scrollable table (default: 'calc(100vh - 300px)') */
  maxHeight?: string;
}
