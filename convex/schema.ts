import { defineSchema } from 'convex/server';

import { itemsTable } from './tables/items';
import { organizationsTable } from './tables/organizations';
import { usersTable } from './tables/users';

// ============================================================
// SCHEMA
// Combines all table definitions from ./tables/
// ============================================================

export default defineSchema({
  users: usersTable,
  items: itemsTable,
  organizations: organizationsTable,
});
