/* eslint-disable */
// Auto-generated - run `npx convex dev` to regenerate

import { makeFunctionReference } from 'convex/server';

export const api = {
  functions: {
    items: {
      getById: makeFunctionReference('functions/items:getById'),
      listByOrganization: makeFunctionReference('functions/items:listByOrganization'),
      listByStatus: makeFunctionReference('functions/items:listByStatus'),
      listByPriority: makeFunctionReference('functions/items:listByPriority'),
      listByAssignee: makeFunctionReference('functions/items:listByAssignee'),
      countByStatus: makeFunctionReference('functions/items:countByStatus'),
      create: makeFunctionReference('functions/items:create'),
      update: makeFunctionReference('functions/items:update'),
      updateStatus: makeFunctionReference('functions/items:updateStatus'),
      assign: makeFunctionReference('functions/items:assign'),
      remove: makeFunctionReference('functions/items:remove'),
    },
    users: {
      getById: makeFunctionReference('functions/users:getById'),
      getByClerkId: makeFunctionReference('functions/users:getByClerkId'),
      getByEmail: makeFunctionReference('functions/users:getByEmail'),
      listByOrganization: makeFunctionReference('functions/users:listByOrganization'),
      create: makeFunctionReference('functions/users:create'),
      update: makeFunctionReference('functions/users:update'),
      remove: makeFunctionReference('functions/users:remove'),
    },
  },
};
