import { defineTable } from 'convex/server';
import { v } from 'convex/values';

// ============================================================
// ORGANIZATIONS TABLE
// Stores organization metadata including logos
// WorkOS handles core org data, Convex handles extended data
// ============================================================

export const organizationsTable = defineTable({
  // WorkOS organization ID (primary key for lookups)
  workosId: v.string(),

  // Logo stored in Convex file storage
  logoId: v.optional(v.id('_storage')),

  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
}).index('by_workos_id', ['workosId']);

// ============================================================
// VALIDATORS
// ============================================================

export const updateOrganizationValidator = v.object({
  logoId: v.optional(v.id('_storage')),
});
