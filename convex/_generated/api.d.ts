/* eslint-disable */
// Auto-generated - run `npx convex dev` to regenerate

import type { FunctionReference } from 'convex/server';

export declare const api: {
  functions: {
    items: {
      getById: FunctionReference<'query'>;
      listByOrganization: FunctionReference<'query'>;
      listByStatus: FunctionReference<'query'>;
      listByPriority: FunctionReference<'query'>;
      listByAssignee: FunctionReference<'query'>;
      countByStatus: FunctionReference<'query'>;
      create: FunctionReference<'mutation'>;
      update: FunctionReference<'mutation'>;
      updateStatus: FunctionReference<'mutation'>;
      assign: FunctionReference<'mutation'>;
      remove: FunctionReference<'mutation'>;
    };
    users: {
      getById: FunctionReference<'query'>;
      getByClerkId: FunctionReference<'query'>;
      getByEmail: FunctionReference<'query'>;
      listByOrganization: FunctionReference<'query'>;
      create: FunctionReference<'mutation'>;
      update: FunctionReference<'mutation'>;
      remove: FunctionReference<'mutation'>;
    };
  };
};
