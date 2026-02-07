import { v } from 'convex/values';

import { mutation } from '../../_generated/server';
import { createItemValidator, itemStatusValidator, updateItemValidator } from '../../tables/items';

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
