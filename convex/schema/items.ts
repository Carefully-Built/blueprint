import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const itemsTable = defineTable({
  name: v.string(),
  description: v.optional(v.string()),
  status: v.union(
    v.literal('draft'),
    v.literal('active'),
    v.literal('archived')
  ),
  priority: v.union(
    v.literal('low'),
    v.literal('medium'),
    v.literal('high')
  ),
  organizationId: v.string(),
  createdBy: v.id('users'),
  assignedTo: v.optional(v.id('users')),
  dueDate: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_organization', ['organizationId'])
  .index('by_status', ['organizationId', 'status'])
  .index('by_assigned', ['assignedTo'])
  .index('by_created', ['organizationId', 'createdAt']);
