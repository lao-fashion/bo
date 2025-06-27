import { DataProvider } from 'react-admin';
import pb from '../api/pocketbase';

export interface User {
  id: string;
  collectionId: string;
  collectionName: string;
  avatar: string;
  username: string;
  full_name: string;
  email: string;
  phone_number: string;
  emailVisibility: boolean;
  verified: boolean;
  created: string;
  updated: string;
}

export const usersDataProvider: Partial<DataProvider> = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: 'id', order: 'ASC' };
    const { q, ...filters } = params.filter;

    try {
      let filter = '';
      const filterParts = [];

      // Search query
      if (q) {
        filterParts.push(`(full_name ~ "${q}" || email ~ "${q}" || username ~ "${q}")`);
      }

      // Other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (typeof value === 'boolean') {
            filterParts.push(`${key} = ${value}`);
          } else if (typeof value === 'string') {
            filterParts.push(`${key} ~ "${value}"`);
          } else {
            filterParts.push(`${key} = ${value}`);
          }
        }
      });

      if (filterParts.length > 0) {
        filter = filterParts.join(' && ');
      }

      const result = await pb.collection('users').getList(page, perPage, {
        sort: order === 'ASC' ? `+${field}` : `-${field}`,
        filter: filter || undefined,
      });

      return {
        data: result.items as any,
        total: result.totalItems,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    try {
      const record = await pb.collection('users').getOne(params.id.toString());
      return { data: record as any };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  create: async (resource, params) => {
    try {
      const record = await pb.collection('users').create(params.data);
      return { data: record as any };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  update: async (resource, params) => {
    try {
      const record = await pb.collection('users').update(params.id, params.data);
      return { data: record as any };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    try {
      await pb.collection('users').delete(params.id.toString());
      return { data: { id: params.id } } as any;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    try {
      await Promise.all(
        params.ids.map(id => pb.collection('users').delete(id.toString()))
      );
      return { data: params.ids };
    } catch (error) {
      console.error('Error deleting users:', error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    try {
      const records = await Promise.all(
        params.ids.map(id => pb.collection('users').getOne(id.toString()))
      );
      return { data: records as any };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: 'id', order: 'ASC' };
    const { target, id } = params;

    try {
      const filter = `${target} = "${id}"`;
      
      const result = await pb.collection('users').getList(page, perPage, {
        sort: order === 'ASC' ? `+${field}` : `-${field}`,
        filter,
      });

      return {
        data: result.items as any,
        total: result.totalItems,
      };
    } catch (error) {
      console.error('Error fetching users reference:', error);
      throw error;
    }
  },
};