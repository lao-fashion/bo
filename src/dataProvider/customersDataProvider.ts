import { DataProvider } from 'react-admin';
import pb from '../api/pocketbase';

export interface Customer {
  id: string;
  username: string;
  name: string;
  phone_number: string;
  avatar: string;
  verified: boolean;
  email: string;
  emailVisibility: boolean;
  address_id: string;
  created: string;
  updated: string;
}

// Function to transform a single customer record
const transformCustomer = (customer: any) => {
  if (customer.avatar) {
    customer.avatar;
  }
  return customer;
};

export const customersDataProvider: Partial<DataProvider> = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: 'id', order: 'ASC' };
    const { q, ...filters } = params.filter;

    try {
      let filter = '';
      const filterParts = [];

      // Search query
      if (q) {
        filterParts.push(
          `(name ~ "${q}" || email ~ "${q}" || username ~ "${q}")`
        );
      }

      // Other filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'has_ordered') {
            // Special handling for has_ordered filter
            if (value === true) {
              filterParts.push(
                `id IN (SELECT DISTINCT customer_id FROM orders WHERE customer_id != "")`
              );
            } else {
              filterParts.push(
                `id NOT IN (SELECT DISTINCT customer_id FROM orders WHERE customer_id != "")`
              );
            }
          } else if (key === 'customer_id') {
            // Handle customer dropdown filter
            filterParts.push(`id = "${value}"`);
          } else if (typeof value === 'boolean') {
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

      const result = await pb.collection('customers').getList(page, perPage, {
        sort: order === 'ASC' ? `+${field}` : `-${field}`,
        filter: filter || undefined,
      });

      return {
        data: result.items.map(transformCustomer) as any,
        total: result.totalItems,
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getOne: async (resource, params) => {
    try {
      const record = await pb
        .collection('customers')
        .getOne(params.id.toString());
      return { data: transformCustomer(record) as any };
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  },

  create: async (resource, params) => {
    try {
      const record = await pb.collection('customers').create(params.data);
      return { data: transformCustomer(record) as any };
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },

  update: async (resource, params) => {
    try {
      const record = await pb
        .collection('customers')
        .update(params.id, params.data);
      return { data: transformCustomer(record) as any };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  delete: async (resource, params) => {
    try {
      await pb.collection('customers').delete(params.id.toString());
      return { data: { id: params.id } } as any;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  },

  deleteMany: async (resource, params) => {
    try {
      await Promise.all(
        params.ids.map((id) => pb.collection('customers').delete(id.toString()))
      );
      return { data: params.ids };
    } catch (error) {
      console.error('Error deleting customers:', error);
      throw error;
    }
  },

  getMany: async (resource, params) => {
    try {
      const records = await Promise.all(
        params.ids.map((id) => pb.collection('customers').getOne(id.toString()))
      );
      return { data: records.map(transformCustomer) as any };
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 10 };
    const { field, order } = params.sort || { field: 'id', order: 'ASC' };
    const { target, id } = params;

    try {
      const filter = `${target} = "${id}"`;

      const result = await pb.collection('customers').getList(page, perPage, {
        sort: order === 'ASC' ? `+${field}` : `-${field}`,
        filter,
      });

      return {
        data: result.items.map(transformCustomer) as any,
        total: result.totalItems,
      };
    } catch (error) {
      console.error('Error fetching customers reference:', error);
      throw error;
    }
  },
};
