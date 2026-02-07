import { api } from '@convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';

import type { Id } from '@convex/_generated/dataModel';

export const ItemsApi = {
  // Queries
  useGetById: (args: { id: Id<'items'> }) => {
    return useQuery(api.functions.items.getById, args);
  },

  useListByOrganization: (args: { organizationId: string; limit?: number }) => {
    return useQuery(api.functions.items.listByOrganization, args);
  },

  useListByStatus: (args: { organizationId: string; status: 'draft' | 'active' | 'archived' }) => {
    return useQuery(api.functions.items.listByStatus, args);
  },

  useListByPriority: (args: { organizationId: string; priority: 'low' | 'medium' | 'high' }) => {
    return useQuery(api.functions.items.listByPriority, args);
  },

  useListByAssignee: (args: { assignedTo: Id<'users'> }) => {
    return useQuery(api.functions.items.listByAssignee, args);
  },

  useCountByStatus: (args: { organizationId: string }) => {
    return useQuery(api.functions.items.countByStatus, args);
  },

  // Mutations
  useCreate: () => {
    return useMutation(api.functions.items.create);
  },

  useUpdate: () => {
    return useMutation(api.functions.items.update);
  },

  useUpdateStatus: () => {
    return useMutation(api.functions.items.updateStatus);
  },

  useAssign: () => {
    return useMutation(api.functions.items.assign);
  },

  useDelete: () => {
    return useMutation(api.functions.items.remove);
  },
};
