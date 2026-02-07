/**
 * Main API Namespace
 *
 * Central export of all React Query hooks for Convex functions.
 * Follows the pattern from the Developer Guide.
 *
 * Usage:
 *   import { API } from '@/api';
 *
 *   const { data } = API.users.useGetById({ id: '123' });
 *   const deleteMutation = API.items.useDelete();
 *   deleteMutation.mutate({ id: 'xyz' });
 *
 * @module api
 */

import { UsersApi } from './users';
import { ItemsApi } from './items';

export const API = {
  users: UsersApi,
  items: ItemsApi,
};
