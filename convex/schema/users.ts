import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const usersTable = defineTable({
  clerkId: v.string(),
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  organizationId: v.optional(v.string()),
  role: v.union(v.literal('admin'), v.literal('member'), v.literal('viewer')),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_clerk_id', ['clerkId'])
  .index('by_email', ['email'])
  .index('by_organization', ['organizationId']);
