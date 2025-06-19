import {
  DataProvider,
  GetListParams,
  GetListResult,
  GetOneParams,
  GetOneResult,
  GetManyParams,
  GetManyResult,
  Identifier,
} from 'react-admin';
import { ApiOrder, ApiOrderResponse } from '../types';
import pb from '../api/pocketbase'; // Import PocketBase instance

const API_BASE_URL = 'http://localhost:8080';

const ordersApiDataProvider: Partial<DataProvider> = {
  getList: async <RecordType extends { id: Identifier } = ApiOrder>(
    resource: string,
    params: GetListParams
  ): Promise<GetListResult<RecordType>> => {
    if (resource !== 'orders') {
      throw new Error(`Unknown resource: ${resource}`);
    }

    const { page = 1, perPage = 25 } = params.pagination || {};
    const { status } = params.filter || {};

    const url = `/order-list`;

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
        ...(status && { status }),
      });

      const response = await pb.send(`${url}?${queryParams}`, {
        method: 'GET',
      });

      const data: ApiOrderResponse = response;

      return {
        data: data.items as unknown as RecordType[],
        total: data.totalItems,
        pageInfo: {
          hasNextPage: data.page < data.totalPages,
          hasPreviousPage: data.page > 1,
        },
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  getOne: async <RecordType extends { id: Identifier } = ApiOrder>(
    resource: string,
    params: GetOneParams<RecordType>
  ): Promise<GetOneResult<RecordType>> => {
    if (resource !== 'orders') {
      throw new Error(`Unknown resource: ${resource}`);
    }

    // Since the API doesn't have a single order endpoint,
    // we'll fetch from the list and find the specific order
    const response = await fetch(`${API_BASE_URL}/order-list?perPage=1000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pb.authStore.token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiOrderResponse = await response.json();
    const order = data.items.find((item) => item.id === params.id.toString());

    if (!order) {
      throw new Error(`Order with id ${params.id} not found`);
    }

    return { data: order as unknown as RecordType };
  },

  getMany: async <RecordType extends { id: Identifier } = ApiOrder>(
    resource: string,
    params: GetManyParams<RecordType>
  ): Promise<GetManyResult<RecordType>> => {
    if (resource !== 'orders') {
      throw new Error(`Unknown resource: ${resource}`);
    }

    // Since the API doesn't have a bulk endpoint,
    // we'll fetch from the list and filter by ids
    const response = await fetch(`${API_BASE_URL}/order-list?perPage=1000`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pb.authStore.token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiOrderResponse = await response.json();
    const orders = data.items.filter((item) =>
      params.ids.includes(item.id.toString())
    );

    return { data: orders as unknown as RecordType[] };
  },

  create: async () => {
    throw new Error('Create operation not supported for orders');
  },

  update: async () => {
    throw new Error('Update operation not supported for orders');
  },

  delete: async () => {
    throw new Error('Delete operation not supported for orders');
  },

  deleteMany: async () => {
    throw new Error('Delete many operation not supported for orders');
  },

  updateMany: async () => {
    throw new Error('Update many operation not supported for orders');
  },

  getManyReference: async () => {
    throw new Error('Get many reference operation not supported for orders');
  },
};

export default ordersApiDataProvider;
