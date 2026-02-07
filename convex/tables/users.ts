import { defineTable } from 'convex/server';
import { v } from 'convex/values';

// ============================================================
// USERS TABLE
// ============================================================

export const usersTable = defineTable({
  // Auth
  clerkId: v.string(),
  email: v.string(),
  
  // Profile
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  
  // Organization
  organizationId: v.optional(v.string()),
  role: v.union(v.literal('admin'), v.literal('member'), v.literal('viewer')),
  
  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index('by_clerk_id', ['clerkId'])
  .index('by_email', ['email'])
  .index('by_organization', ['organizationId']);

// ============================================================
// VALIDATORS (for use in functions)
// ============================================================

export const userRoleValidator = v.union(
  v.literal('admin'),
  v.literal('member'),
  v.literal('viewer')
);

export const createUserValidator = v.object({
  clerkId: v.string(),
  email: v.string(),
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  organizationId: v.optional(v.string()),
  role: userRoleValidator,
});

export const updateUserValidator = v.object({
  name: v.optional(v.string()),
  imageUrl: v.optional(v.string()),
  organizationId: v.optional(v.string()),
  role: v.optional(userRoleValidator),
});
