export enum ItemStatus {
  Draft = 'draft',
  Active = 'active',
  Archived = 'archived',
}

export enum ItemPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export interface Item {
  _id: string;
  name: string;
  description?: string;
  status: ItemStatus;
  priority: ItemPriority;
  organizationId: string;
  createdBy: string;
  assignedTo?: string;
  dueDate?: number;
  createdAt: number;
  updatedAt: number;
}

// Type guards
export const isDraft = (item: Item): boolean => item.status === ItemStatus.Draft;
export const isActive = (item: Item): boolean => item.status === ItemStatus.Active;
export const isArchived = (item: Item): boolean => item.status === ItemStatus.Archived;
