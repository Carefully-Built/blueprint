import { v } from 'convex/values';

import { query } from '../../_generated/server';

/**
 * Get all files for an organization with URLs
 */
export const listByOrganization = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query('files')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .order('desc')
      .collect();

    // Get URLs for all files
    return Promise.all(
      files.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );
  },
});

/**
 * Get a single file by ID with URL
 */
export const getById = query({
  args: { id: v.id('files') },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) return null;
    
    return {
      ...file,
      url: await ctx.storage.getUrl(file.storageId),
    };
  },
});

/**
 * Get files by type (images, documents, etc.)
 */
export const listByType = query({
  args: { 
    organizationId: v.string(),
    mimeTypePrefix: v.string(), // e.g., 'image/', 'application/pdf'
  },
  handler: async (ctx, args) => {
    const allFiles = await ctx.db
      .query('files')
      .withIndex('by_organization', (q) => q.eq('organizationId', args.organizationId))
      .collect();

    const filtered = allFiles.filter((f) => f.mimeType.startsWith(args.mimeTypePrefix));

    return Promise.all(
      filtered.map(async (file) => ({
        ...file,
        url: await ctx.storage.getUrl(file.storageId),
      }))
    );
  },
});
