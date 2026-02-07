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

export const getByWorkosId = query({
  args: { workosId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
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
// SYNC (WorkOS)
// ----------------------------------------------------------

export const syncFromWorkOS = mutation({
  args: createUserValidator,
  handler: async (ctx, args) => {
    // Check if user exists by WorkOS ID
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        firstName: args.firstName,
        lastName: args.lastName,
        imageUrl: args.imageUrl,
        organizationId: args.organizationId,
        role: args.role,
        updatedAt: now,
      });
      return existingUser._id;
    } else {
      // Create new user
      return await ctx.db.insert('users', {
        ...args,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// ----------------------------------------------------------
// API OBJECT
// Use this for a quick overview of all available functions
// ----------------------------------------------------------

export const UsersAPI = {
  // Queries
  getById,
  getByWorkosId,
  getByEmail,
  listByOrganization,

  // Mutations
  create,
  update,
  remove,
  syncFromWorkOS,
} as const;
