'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';

import { formatValue, getNestedValue } from './utils';

import type { ActionHandlers, ActionType, Column } from './types';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';



interface DesktopViewProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  skeletonRows: number;
  actions?: ActionType[];
  actionHandlers?: ActionHandlers<T>;
  renderActions?: (item: T) => ReactNode;
  noDataMessage: string;
  getRowKey: (item: T) => string | number;
  onRowClick?: (item: T) => void;
}

const ActionIcons: Record<ActionType, typeof Eye> = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
};

export function DesktopView<T>({
  data,
  columns,
  isLoading,
  skeletonRows,
  actions,
  actionHandlers,
  renderActions,
  noDataMessage,
  getRowKey,
  onRowClick,
}: DesktopViewProps<T>): React.ReactElement {
  const hasActions = (actions?.length ?? 0) > 0 || renderActions !== undefined;

  const renderCellValue = (column: Column<T>, item: T): ReactNode => {
    const value = column.accessor
      ? typeof column.accessor === 'string' && column.accessor.includes('.')
        ? getNestedValue(item, column.accessor)
        : (item as Record<string, unknown>)[column.accessor as string]
      : null;

    if (column.render) {
      return column.render(value, item);
    }

    return formatValue(value);
  };

  const renderActionButtons = (item: T): ReactNode => {
    if (renderActions) {
      return renderActions(item);
    }

    if (!actions || !actionHandlers) {
      return null;
    }

    return (
      <div className="flex items-center gap-1">
        {actions.map((action) => {
          const Icon = ActionIcons[action];
          const handler = actionHandlers[`on${action.charAt(0).toUpperCase()}${action.slice(1)}` as keyof ActionHandlers<T>];
          
          return (
            <Button
              key={action}
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={(e) => {
                e.stopPropagation();
                (handler as ((item: T) => void) | undefined)?.(item);
              }}
            >
              <Icon className="size-4" />
            </Button>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.header} style={{ width: col.width }}>
                {col.header}
              </TableHead>
            ))}
            {hasActions ? <TableHead className="w-24">Actions</TableHead> : null}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col.header}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
              {hasActions ? (
                <TableCell>
                  <Skeleton className="h-8 w-20" />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        {noDataMessage}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.header}
              style={{ width: col.width }}
              className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
            >
              {col.header}
            </TableHead>
          ))}
          {hasActions ? <TableHead className="w-24">Actions</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow
            key={getRowKey(item)}
            className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            onClick={() => onRowClick?.(item)}
          >
            {columns.map((col) => (
              <TableCell
                key={col.header}
                className={col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''}
              >
                {renderCellValue(col, item)}
              </TableCell>
            ))}
            {hasActions ? (
              <TableCell>{renderActionButtons(item)}</TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
