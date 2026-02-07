/* eslint-disable */
// Auto-generated - run `npx convex dev` to regenerate

export type Id<TableName extends string> = string & { __tableName: TableName };

export interface DataModel {
  users: {
    _id: Id<'users'>;
    clerkId: string;
    email: string;
    name?: string;
    imageUrl?: string;
    organizationId?: string;
    role: 'admin' | 'member' | 'viewer';
    createdAt: number;
    updatedAt: number;
  };
  items: {
    _id: Id<'items'>;
    name: string;
    description?: string;
    status: 'draft' | 'active' | 'archived';
    priority: 'low' | 'medium' | 'high';
    organizationId: string;
    createdBy: Id<'users'>;
    assignedTo?: Id<'users'>;
    dueDate?: number;
    createdAt: number;
    updatedAt: number;
  };
}
