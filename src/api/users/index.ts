import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';

export const UsersApi = {
  // Queries
  useGetById: (args: { id: Id<'users'> }) => {
    return useQuery(api.functions.users.getById, args);
  },

  useGetByWorkosId: (args: { workosId: string }) => {
    return useQuery(api.functions.users.getByWorkosId, args);
  },

  useGetByEmail: (args: { email: string }) => {
    return useQuery(api.functions.users.getByEmail, args);
  },

  useListByOrganization: (args: { organizationId: string }) => {
    return useQuery(api.functions.users.listByOrganization, args);
  },

  // Mutations
  useCreate: () => {
    return useMutation(api.functions.users.create);
  },

  useUpdate: () => {
    return useMutation(api.functions.users.update);
  },

  useDelete: () => {
    return useMutation(api.functions.users.remove);
  },

  useSyncFromWorkOS: () => {
    return useMutation(api.functions.users.syncFromWorkOS);
  },
};
