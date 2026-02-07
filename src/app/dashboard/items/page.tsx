'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { ItemForm } from './_components/ItemForm';

import type { Column, ActionHandlers } from '@/components/shared/SmartTable';

import { ResponsiveSheet } from '@/components/shared/ResponsiveSheet';
import { SmartTable } from '@/components/shared/SmartTable';
import { Button } from '@/components/ui/button';

// Mock data - replace with Convex query
interface Item {
  _id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

const mockItems: Item[] = [
  { _id: '1', name: 'Design system', description: 'Create component library', status: 'active', priority: 'high', createdAt: Date.now() },
  { _id: '2', name: 'API integration', description: 'Connect to backend', status: 'draft', priority: 'medium', createdAt: Date.now() },
  { _id: '3', name: 'Documentation', status: 'archived', priority: 'low', createdAt: Date.now() },
];

const columns: Column<Item>[] = [
  { header: 'Name', accessor: 'name', width: '30%' },
  { header: 'Description', accessor: 'description', hideOnMobile: true },
  { 
    header: 'Status', 
    accessor: 'status',
    render: (value) => {
      const statusColors: Record<string, string> = {
        draft: 'bg-yellow-100 text-yellow-800',
        active: 'bg-green-100 text-green-800',
        archived: 'bg-gray-100 text-gray-800',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[value as string] ?? ''}`}>
          {String(value)}
        </span>
      );
    },
  },
  { 
    header: 'Priority', 
    accessor: 'priority',
    hideOnMobile: true,
    render: (value) => {
      const priorityColors: Record<string, string> = {
        low: 'text-gray-500',
        medium: 'text-yellow-600',
        high: 'text-red-600',
      };
      return (
        <span className={`font-medium ${priorityColors[value as string] ?? ''}`}>
          {String(value)}
        </span>
      );
    },
  },
];

export default function ItemsPage(): React.ReactElement {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isLoading] = useState(false);

  const actionHandlers: ActionHandlers<Item> = {
    onView: (_item) => {
      // TODO: Implement view action - navigate to detail page
    },
    onEdit: (item) => {
      setEditingItem(item);
      setIsSheetOpen(true);
    },
    onDelete: (_item) => {
      // TODO: Implement delete action - show confirmation dialog
    },
  };

  const handleCreate = (): void => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  const handleSubmit = (_data: { name: string; description?: string; status: 'draft' | 'active' | 'archived'; priority: 'low' | 'medium' | 'high' }): void => {
    // TODO: Implement save - call Convex mutation
    setIsSheetOpen(false);
    setEditingItem(null);
  };

  const handleCancel = (): void => {
    setIsSheetOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground">Manage your items</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 size-4" />
          New Item
        </Button>
      </div>

      <SmartTable
        data={mockItems}
        columns={columns}
        isLoading={isLoading}
        actions={['edit', 'delete']}
        actionHandlers={actionHandlers}
        noDataMessage="No items found"
      />

      <ResponsiveSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title={editingItem ? 'Edit Item' : 'New Item'}
      >
        <ItemForm
          defaultValues={editingItem ?? undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </ResponsiveSheet>
    </div>
  );
}
