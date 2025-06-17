import { DataProvider, GetListParams, GetListResult } from 'react-admin';
import { ApiOrder, ApiOrderResponse } from '../types';

const API_BASE_URL = 'https://sensornode.shop';

const ordersApiDataProvider: Partial<DataProvider> = {
    getList: async (resource: string, params: GetListParams): Promise<GetListResult<ApiOrder>> => {
        if (resource !== 'orders') {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const { page = 1, perPage = 25 } = params.pagination || {};
        const { status } = params.filter || {};
        
        const searchParams = new URLSearchParams({
            page: page.toString(),
            perPage: perPage.toString(),
            ...(status && { status }),
        });

        const url = `${API_BASE_URL}/order-list?${searchParams}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: ApiOrderResponse = await response.json();
            
            return {
                data: data.items,
                total: data.totalItems,
                pageInfo: {
                    hasNextPage: data.page < data.totalPages,
                    hasPreviousPage: data.page > 1,
                }
            };
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    getOne: async (resource: string, params: { id: string }) => {
        if (resource !== 'orders') {
            throw new Error(`Unknown resource: ${resource}`);
        }
        
        // Since the API doesn't have a single order endpoint, 
        // we'll fetch from the list and find the specific order
        const response = await fetch(`${API_BASE_URL}/order-list?perPage=1000`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiOrderResponse = await response.json();
        const order = data.items.find(item => item.id === params.id);
        
        if (!order) {
            throw new Error(`Order with id ${params.id} not found`);
        }
        
        return { data: order };
    },

    getMany: async (resource: string, params: { ids: string[] }) => {
        if (resource !== 'orders') {
            throw new Error(`Unknown resource: ${resource}`);
        }
        
        // Since the API doesn't have a bulk endpoint, 
        // we'll fetch from the list and filter by ids
        const response = await fetch(`${API_BASE_URL}/order-list?perPage=1000`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiOrderResponse = await response.json();
        const orders = data.items.filter(item => params.ids.includes(item.id));
        
        return { data: orders };
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