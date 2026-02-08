import { v } from 'convex/values';

import { mutation } from '../../_generated/server';

/**
 * Generate an upload URL for client-side file upload
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Save file metadata after upload
 */
export const saveFile = mutation({
  args: {
    storageId: v.id('_storage'),
    name: v.string(),
    mimeType: v.string(),
    size: v.number(),
    organizationId: v.string(),
    uploadedBy: v.id('users'),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('files', {
      storageId: args.storageId,
      name: args.name,
      mimeType: args.mimeType,
      size: args.size,
      organizationId: args.organizationId,
      uploadedBy: args.uploadedBy,
      createdAt: Date.now(),
    });
  },
});

/**
 * Rename a file
 */
export const rename = mutation({
  args: {
    id: v.id('files'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { name: args.name });
    return await ctx.db.get(args.id);
  },
});

/**
 * Delete a file (removes from storage and database)
 */
export const remove = mutation({
  args: { id: v.id('files') },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.id);
    if (!file) throw new Error('File not found');
    
    // Delete from storage
    await ctx.storage.delete(file.storageId);
    
    // Delete from database
    await ctx.db.delete(args.id);
  },
});
