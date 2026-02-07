'use client';

import { Download, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQuery } from 'convex/react';

import { Button } from '@/components/ui/button';
import { ResponsiveSheet } from '@/components/shared/ResponsiveSheet';
import { SmartTable } from '@/components/shared/SmartTable';
import { api } from '@/../convex/_generated/api';

import { ItemForm } from './_components/ItemForm';

import type { ActionHandlers, Column } from '@/components/shared/SmartTable';
import type { Id } from '@/../convex/_generated/dataModel';

interface Item {
  _id: Id<'items'>;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  priority: 'low' | 'medium' | 'high';
  createdAt: number;
}

const statusColors: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
};

const priorityColors: Record<string, string> = {
  low: 'text-gray-500',
  medium: 'text-yellow-600',
  high: 'text-red-600',
};

const columns: Column<Item>[] = [
  { header: 'Name', accessor: 'name', width: '30%' },
  { header: 'Description', accessor: 'description', hideOnMobile: true },
  {
    header: 'Status',
    accessor: 'status',
    render: (value) => (
      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[value as string] ?? ''}`}>
        {String(value)}
      </span>
    ),
  },
  {
    header: 'Priority',
    accessor: 'priority',
    hideOnMobile: true,
    render: (value) => (
      <span className={`font-medium ${priorityColors[value as string] ?? ''}`}>
        {String(value)}
      </span>
    ),
  },
];

export default function ItemsPage(): React.ReactElement {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  
  // Convex queries and mutations
  const items = useQuery(api.functions.items.listByOrganization, { organizationId: 'default' });
  const users = useQuery(api.functions.users.listByOrganization, { organizationId: 'default' });
  const createItem = useMutation(api.functions.items.create);
  const updateItem = useMutation(api.functions.items.update);
  const deleteItem = useMutation(api.functions.items.remove);

  const isLoading = items === undefined;
  
  // Get the first user as fallback (the one who just signed in)
  // In production, you'd want proper user context from server components
  const currentUser = users?.[0];

  const actionHandlers: ActionHandlers<Item> = {
    onEdit: (item) => {
      setEditingItem(item);
      setIsSheetOpen(true);
    },
    onDelete: (item) => {
      toast.error(`Delete "${item.name}"?`, {
        action: {
          label: 'Confirm',
          onClick: () => {
            void deleteItem({ id: item._id }).then(() => {
              toast.success(`"${item.name}" deleted`);
            });
          },
        },
      });
    },
  };

  const handleCreate = (): void => {
    setEditingItem(null);
    setIsSheetOpen(true);
  };

  const handleDownload = (): void => {
    toast.info('Exporting items...');
  };

  const handleSubmit = async (data: { 
    name: string; 
    description?: string; 
    status: 'draft' | 'active' | 'archived'; 
    priority: 'low' | 'medium' | 'high';
  }): Promise<void> => {
    try {
      if (editingItem) {
        await updateItem({ 
          id: editingItem._id, 
          data: {
            name: data.name,
            description: data.description,
            status: data.status,
            priority: data.priority,
          }
        });
        toast.success('Item updated');
      } else {
        if (!currentUser?._id) {
          toast.error('No user found. Please sign out and sign back in.');
          return;
        }
        await createItem({ 
          data: {
            name: data.name,
            description: data.description,
            status: data.status,
            priority: data.priority,
            organizationId: 'default',
          },
          createdBy: currentUser._id,
        });
        toast.success('Item created');
      }
      setIsSheetOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Something went wrong');
    }
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
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 size-4" />
            New Item
          </Button>
        </div>
      </div>

      <SmartTable
        data={items ?? []}
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
          onSubmit={(data) => void handleSubmit(data)}
          onCancel={handleCancel}
        />
      </ResponsiveSheet>
    </div>
  );
}
