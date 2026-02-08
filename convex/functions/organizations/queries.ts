import { v } from 'convex/values';

import { query } from '../../_generated/server';

// ============================================================
// GET ORGANIZATION BY WORKOS ID
// Returns organization with logo URL if available
// ============================================================

export const getByWorkosId = query({
  args: { workosId: v.string() },
  handler: async (ctx, args) => {
    const org = await ctx.db
      .query('organizations')
      .withIndex('by_workos_id', (q) => q.eq('workosId', args.workosId))
      .unique();

    if (!org) {
      return null;
    }

    // Get the logo URL if we have a logo
    let logoUrl: string | null = null;
    if (org.logoId) {
      logoUrl = await ctx.storage.getUrl(org.logoId);
    }

    return {
      ...org,
      logoUrl,
    };
  },
});
