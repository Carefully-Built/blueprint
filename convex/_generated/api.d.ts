/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as functions_index from "../functions/index.js";
import type * as functions_items_index from "../functions/items/index.js";
import type * as functions_items_mutations from "../functions/items/mutations.js";
import type * as functions_items_queries from "../functions/items/queries.js";
import type * as functions_users_index from "../functions/users/index.js";
import type * as functions_users_mutations from "../functions/users/mutations.js";
import type * as functions_users_queries from "../functions/users/queries.js";
import type * as http from "../http.js";
import type * as tables_index from "../tables/index.js";
import type * as tables_items from "../tables/items.js";
import type * as tables_users from "../tables/users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "functions/index": typeof functions_index;
  "functions/items/index": typeof functions_items_index;
  "functions/items/mutations": typeof functions_items_mutations;
  "functions/items/queries": typeof functions_items_queries;
  "functions/users/index": typeof functions_users_index;
  "functions/users/mutations": typeof functions_users_mutations;
  "functions/users/queries": typeof functions_users_queries;
  http: typeof http;
  "tables/index": typeof tables_index;
  "tables/items": typeof tables_items;
  "tables/users": typeof tables_users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  workOSAuthKit: {
    lib: {
      enqueueWebhookEvent: FunctionReference<
        "mutation",
        "internal",
        {
          apiKey: string;
          event: string;
          eventId: string;
          eventTypes?: Array<string>;
          logLevel?: "DEBUG";
          onEventHandle?: string;
          updatedAt?: string;
        },
        any
      >;
      getAuthUser: FunctionReference<
        "query",
        "internal",
        { id: string },
        {
          createdAt: string;
          email: string;
          emailVerified: boolean;
          externalId?: null | string;
          firstName?: null | string;
          id: string;
          lastName?: null | string;
          lastSignInAt?: null | string;
          locale?: null | string;
          metadata: Record<string, any>;
          profilePictureUrl?: null | string;
          updatedAt: string;
        } | null
      >;
    };
  };
};
