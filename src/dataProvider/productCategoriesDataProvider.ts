import { DataProvider } from 'react-admin';
import pb, {
  fetchAllPocketbaseDocuments,
  fetchPocketbaseDocument,
  createPocketbaseDocument,
  updatePocketbaseDocument,
  deletePocketbaseDocument,
} from '../api/pocketbase';

export interface ProductCategory {
  id: string;
  collectionId: string;
  collectionName: string;
  name: string;
  name_la: string;
  image_url: string;
  created: string;
  updated: string;
}

const COLLECTION_NAME = 'product_categories';

export const productCategoriesDataProvider: any = {
  getList: async (resource: string, params: any) => {
    const { page = 1, perPage = 25 } = params.pagination || {};
    const { field = 'created', order = 'DESC' } = params.sort || {};
    const filter = params.filter || {};

    try {
      let query = pb
        .collection(COLLECTION_NAME)
        .getList<ProductCategory>(page, perPage, {
          sort: `${order === 'ASC' ? '+' : '-'}${field}`,
          filter: Object.keys(filter || {})
            .map((key) => `${key} ~ "${filter[key]}"`)
            .join(' && '),
        });

      const result = await query;
      return {
        data: result.items,
        total: result.totalItems,
      };
    } catch (error) {
      console.error('Error fetching product categories:', error);
      throw error;
    }
  },

  getOne: async (resource: string, params: any) => {
    try {
      const data = await fetchPocketbaseDocument<ProductCategory>(
        COLLECTION_NAME,
        String(params.id)
      );
      return { data };
    } catch (error) {
      console.error('Error fetching product category:', error);
      throw error;
    }
  },

  getMany: async (resource: string, params: any) => {
    try {
      const data = await Promise.all(
        params.ids.map((id: any) =>
          fetchPocketbaseDocument<ProductCategory>(COLLECTION_NAME, String(id))
        )
      );
      return { data };
    } catch (error) {
      console.error('Error fetching multiple product categories:', error);
      throw error;
    }
  },

  create: async (resource: string, params: any) => {
    try {
      const id = await createPocketbaseDocument(COLLECTION_NAME, params.data);
      const data = await fetchPocketbaseDocument<ProductCategory>(
        COLLECTION_NAME,
        id
      );
      return { data };
    } catch (error) {
      console.error('Error creating product category:', error);
      throw error;
    }
  },

  update: async (resource: string, params: any) => {
    try {
      await updatePocketbaseDocument(
        COLLECTION_NAME,
        String(params.id),
        params.data
      );
      const data = await fetchPocketbaseDocument<ProductCategory>(
        COLLECTION_NAME,
        String(params.id)
      );
      return { data };
    } catch (error) {
      console.error('Error updating product category:', error);
      throw error;
    }
  },

  delete: async (resource: string, params: any) => {
    try {
      await deletePocketbaseDocument(COLLECTION_NAME, String(params.id));
      return { data: params.previousData };
    } catch (error) {
      console.error('Error deleting product category:', error);
      throw error;
    }
  },

  deleteMany: async (resource: string, params: any) => {
    try {
      await Promise.all(
        params.ids.map((id: any) =>
          deletePocketbaseDocument(COLLECTION_NAME, String(id))
        )
      );
      return { data: params.ids };
    } catch (error) {
      console.error('Error deleting multiple product categories:', error);
      throw error;
    }
  },
};
