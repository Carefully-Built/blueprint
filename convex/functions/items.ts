import { v } from 'convex/values';

import { mutation, query } from '../_generated/server';
import {
  createItemValidator,
  itemPriorityValidator,
  itemStatusValidator,
  updateItemValidator,
} from '../tables/items';

// ============================================================
// ITEMS API
// All queries and mutations for the items table
// ============================================================

// ----------------------------------------------------------
// QUERIES
// ----------------------------------------------------------

export const getById = query({
  args: { id: v.id('items') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listByOrganization = query({
  args: {
    organizationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const q = ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId));
    
    if (args.limit) {
      return await q.take(args.limit);
    }
    
    return await q.collect();
  },
});

export const listByStatus = query({
  args: {
    organizationId: v.string(),
    status: itemStatusValidator,
  },
  handler: async (ctx, args) => {
    const allItems = await ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();
    
    return allItems.filter((item) => item.status === args.status);
  },
});

export const listByPriority = query({
  args: {
    organizationId: v.string(),
    priority: itemPriorityValidator,
  },
  handler: async (ctx, args) => {
    const allItems = await ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();
    
    return allItems.filter((item) => item.priority === args.priority);
  },
});

export const listByAssignee = query({
  args: { assignedTo: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('items')
      .withIndex('by_assigned', (q) => q.eq('assignedTo', args.assignedTo))
      .collect();
  },
});

export const countByStatus = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();
    
    return {
      draft: items.filter((i) => i.status === 'draft').length,
      active: items.filter((i) => i.status === 'active').length,
      archived: items.filter((i) => i.status === 'archived').length,
      total: items.length,
    };
  },
});

// ----------------------------------------------------------
// MUTATIONS
// ----------------------------------------------------------

export const create = mutation({
  args: {
    data: createItemValidator,
    createdBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert('items', {
      ...args.data,
      createdBy: args.createdBy,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id('items'),
    data: updateItemValidator,
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

export const updateStatus = mutation({
  args: {
    id: v.id('items'),
    status: itemStatusValidator,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    return await ctx.db.get(args.id);
  },
});

export const assign = mutation({
  args: {
    id: v.id('items'),
    assignedTo: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      assignedTo: args.assignedTo,
      updatedAt: Date.now(),
    });
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id('items') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ----------------------------------------------------------
// API OBJECT
// Use this for a quick overview of all available functions
// ----------------------------------------------------------

export const ItemsAPI = {
  // Queries
  getById,
  listByOrganization,
  listByStatus,
  listByPriority,
  listByAssignee,
  countByStatus,
  
  // Mutations
  create,
  update,
  updateStatus,
  assign,
  remove,
} as const;
