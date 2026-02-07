import { v } from 'convex/values';

import { query } from '../../_generated/server';
import { itemPriorityValidator, itemStatusValidator } from '../../tables/items';

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
