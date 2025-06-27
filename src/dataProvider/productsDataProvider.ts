import pb, {
  createPocketbaseDocument,
  deletePocketbaseDocument,
  fetchPocketbaseDocument,
  updatePocketbaseDocument,
} from '../api/pocketbase';

export interface ProductData {
  collectionId: string;
  collectionName: string;
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string[];
  name_la: string;
  description_la: string;
  details: string;
  created: string;
  updated: string;
}

export interface ProductFilter {
  q?: string;
  category_id?: string;
  price_gte?: number;
  price_lte?: number;
  name?: string;
  sales_best?: boolean;
  sales_average?: boolean;
  sales_low?: boolean;
  sales_never?: boolean;
  stock_out?: boolean;
  stock_low?: boolean;
  stock_medium?: boolean;
  stock_high?: boolean;
}

export interface ProductListParams {
  pagination: { page: number; perPage: number };
  sort: { field: string; order: 'ASC' | 'DESC' };
  filter: ProductFilter;
}

export interface ProductListResponse {
  data: ProductData[];
  total: number;
}

export const productsDataProvider: any = {
  getList: async (
    resource: string,
    params: ProductListParams
  ): Promise<ProductListResponse> => {
    const { pagination, sort, filter } = params;
    const { page, perPage } = pagination;
    const { field, order } = sort;

    let filterStr = '';
    const filterConditions: string[] = [];

    if (filter.q) {
      filterConditions.push(
        `(name ~ "${filter.q}" || description ~ "${filter.q}" || name_la ~ "${filter.q}" || description_la ~ "${filter.q}")`
      );
    }

    if (filter.category_id) {
      filterConditions.push(`category_id = "${filter.category_id}"`);
    }

    if (filter.price_gte) {
      filterConditions.push(`price >= ${filter.price_gte}`);
    }

    if (filter.price_lte) {
      filterConditions.push(`price <= ${filter.price_lte}`);
    }

    // Stock filters (assuming we have a stock field)
    const stockFilters: string[] = [];
    if (filter.stock_out) {
      stockFilters.push('stock = 0');
    }
    if (filter.stock_low) {
      stockFilters.push('(stock >= 1 && stock <= 9)');
    }
    if (filter.stock_medium) {
      stockFilters.push('(stock >= 10 && stock <= 49)');
    }
    if (filter.stock_high) {
      stockFilters.push('stock >= 50');
    }
    if (stockFilters.length > 0) {
      filterConditions.push(`(${stockFilters.join(' || ')})`);
    }

    // Sales filters (assuming we have sales data or need to calculate from orders)
    const salesFilters: string[] = [];
    if (filter.sales_best) {
      salesFilters.push('sales_count > 100'); // Adjust threshold as needed
    }
    if (filter.sales_average) {
      salesFilters.push('(sales_count >= 10 && sales_count <= 100)');
    }
    if (filter.sales_low) {
      salesFilters.push('(sales_count >= 1 && sales_count < 10)');
    }
    if (filter.sales_never) {
      salesFilters.push('sales_count = 0');
    }
    if (salesFilters.length > 0) {
      filterConditions.push(`(${salesFilters.join(' || ')})`);
    }

    if (filterConditions.length > 0) {
      filterStr = filterConditions.join(' && ');
    }

    const sortStr = `${order === 'DESC' ? '-' : ''}${field}`;

    try {
      const result = await pb.collection('products').getList(page, perPage, {
        filter: filterStr,
        sort: sortStr,
        expand: 'category_id',
      });

      return {
        data: result.items as ProductData[],
        total: result.totalItems,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  getOne: async (
    resource: string,
    params: { id: string }
  ): Promise<{ data: ProductData }> => {
    try {
      const record = await fetchPocketbaseDocument<ProductData>(
        'products',
        params.id
      );
      return { data: record };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  },

  getMany: async (
    resource: string,
    params: { ids: string[] }
  ): Promise<{ data: ProductData[] }> => {
    try {
      const filterStr = params.ids.map((id) => `id = "${id}"`).join(' || ');
      const result = await pb
        .collection('products')
        .getList(1, params.ids.length, {
          filter: filterStr,
        });
      return { data: result.items as ProductData[] };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw new Error('Failed to fetch products');
    }
  },

  getManyReference: async (
    resource: string,
    params: {
      target: string;
      id: string;
      pagination: { page: number; perPage: number };
      sort: { field: string; order: 'ASC' | 'DESC' };
      filter: ProductFilter;
    }
  ): Promise<ProductListResponse> => {
    const { target, id, pagination, sort, filter } = params;
    const { page, perPage } = pagination;
    const { field, order } = sort;

    const filterConditions: string[] = [`${target} = "${id}"`];

    if (filter.q) {
      filterConditions.push(
        `(name ~ "${filter.q}" || description ~ "${filter.q}")`
      );
    }

    const filterStr = filterConditions.join(' && ');
    const sortStr = `${order === 'DESC' ? '-' : ''}${field}`;

    try {
      const result = await pb.collection('products').getList(page, perPage, {
        filter: filterStr,
        sort: sortStr,
      });

      return {
        data: result.items as ProductData[],
        total: result.totalItems,
      };
    } catch (error) {
      console.error('Error fetching related products:', error);
      throw new Error('Failed to fetch related products');
    }
  },

  create: async (
    resource: string,
    params: { data: Partial<ProductData> }
  ): Promise<{ data: ProductData }> => {
    try {
      const id = await createPocketbaseDocument('products', params.data);
      const record = await fetchPocketbaseDocument<ProductData>('products', id);
      return { data: record };
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  },

  update: async (
    resource: string,
    params: { id: string; data: Partial<ProductData> }
  ): Promise<{ data: ProductData }> => {
    const { id, data } = params;
    try {
      await updatePocketbaseDocument('products', id, data);
      const record = await fetchPocketbaseDocument<ProductData>('products', id);
      return { data: record };
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  },

  updateMany: async (
    resource: string,
    params: { ids: string[]; data: Partial<ProductData> }
  ): Promise<{ data: string[] }> => {
    const { ids, data } = params;
    try {
      await Promise.all(
        ids.map((id) => updatePocketbaseDocument('products', id, data))
      );
      return { data: ids };
    } catch (error) {
      console.error('Error updating products:', error);
      throw new Error('Failed to update products');
    }
  },

  delete: async (
    resource: string,
    params: { id: string }
  ): Promise<{ data: ProductData }> => {
    const { id } = params;
    try {
      const record = await fetchPocketbaseDocument<ProductData>('products', id);
      await deletePocketbaseDocument('products', id);
      return { data: record };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  },

  deleteMany: async (
    resource: string,
    params: { ids: string[] }
  ): Promise<{ data: string[] }> => {
    const { ids } = params;
    try {
      await Promise.all(
        ids.map((id) => deletePocketbaseDocument('products', id))
      );
      return { data: ids };
    } catch (error) {
      console.error('Error deleting products:', error);
      throw new Error('Failed to delete products');
    }
  },
};
