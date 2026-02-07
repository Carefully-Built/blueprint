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
}
