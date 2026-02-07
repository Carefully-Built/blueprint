import { v } from 'convex/values';

import { mutation, query } from '../_generated/server';
import { createUserValidator, updateUserValidator } from '../tables/users';

// ============================================================
// USERS API
// All queries and mutations for the users table
// ============================================================

// ----------------------------------------------------------
// QUERIES
// ----------------------------------------------------------

export const getById = query({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', args.clerkId))
      .first();
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
  },
});

export const listByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();
  },
});

// ----------------------------------------------------------
// MUTATIONS
// ----------------------------------------------------------

export const create = mutation({
  args: createUserValidator,
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('users', {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('users'),
    data: updateUserValidator,
  },
  handler: async (ctx, args) => {
    const { id, data } = args;
    await ctx.db.patch(id, {
      ...data,
      updatedAt: Date.now(),
    });
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ----------------------------------------------------------
// API OBJECT
// Use this for a quick overview of all available functions
// ----------------------------------------------------------

export const UsersAPI = {
  // Queries
  getById,
  getByClerkId,
  getByEmail,
  listByOrganization,
  
  // Mutations
  create,
  update,
  remove,
} as const;
