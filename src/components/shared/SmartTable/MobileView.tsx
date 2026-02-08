'use client';

import { Eye, Pencil, Trash2 } from 'lucide-react';

import { formatValue, getNestedValue } from './utils';

import type { ActionHandlers, ActionType, Column, PaginationConfig } from './types';
import type { ReactNode } from 'react';

import { Pagination } from '@/components/shared/Pagination';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MobileViewProps<T> {
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
  renderMobileCard?: (item: T) => ReactNode;
  pagination?: PaginationConfig;
}

const ActionIcons: Record<ActionType, typeof Eye> = {
  view: Eye,
  edit: Pencil,
  delete: Trash2,
};

export function MobileView<T>({
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
  renderMobileCard,
  pagination,
}: MobileViewProps<T>): React.ReactElement {
  const visibleColumns = columns.filter((col) => !col.hideOnMobile);
  const hasActions = (actions?.length ?? 0) > 0 || renderActions !== undefined;

  const renderValue = (column: Column<T>, item: T): ReactNode => {
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

  const paginationComponent = pagination && (
    <Pagination
      currentPage={pagination.currentPage}
      totalPages={pagination.totalPages}
      totalItems={pagination.totalItems}
      pageSize={pagination.pageSize}
      startIndex={pagination.startIndex}
      endIndex={pagination.endIndex}
      onPageChange={pagination.onPageChange}
    />
  );

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="space-y-3">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {paginationComponent}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          {noDataMessage}
        </div>
        {pagination && pagination.totalItems > 0 && paginationComponent}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="space-y-3">
        {data.map((item) => (
          <Card
            key={getRowKey(item)}
            className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            onClick={() => onRowClick?.(item)}
          >
            <CardContent className="p-4">
              {renderMobileCard ? (
                renderMobileCard(item)
              ) : (
                <div className="space-y-2">
                  {visibleColumns.map((col, index) => (
                    <div
                      key={col.header}
                      className={index === 0 ? 'font-medium' : 'flex justify-between text-sm'}
                    >
                      {index === 0 ? (
                        renderValue(col, item)
                      ) : (
                        <>
                          <span className="text-muted-foreground">{col.header}</span>
                          <span>{renderValue(col, item)}</span>
                        </>
                      )}
                    </div>
                  ))}
                  {hasActions ? (
                    <div className="flex justify-end pt-2 border-t mt-3">
                      {renderActionButtons(item)}
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {paginationComponent}
    </div>
  );
}
