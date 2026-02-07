import { defineSchema } from 'convex/server';

import { itemsTable } from './schema/items';
import { usersTable } from './schema/users';

export default defineSchema({
  users: usersTable,
  items: itemsTable,
});
