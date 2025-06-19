import { DataProvider } from 'react-admin';
import { blogService } from '../api/blogsService';

export const blogsDataProvider: Partial<DataProvider> = {
  getList: async (resource, params) => {
    if (resource !== 'blogs') return { data: [], total: 0 };
    
    const { page, perPage } = params.pagination || { page: 1, perPage: 25 };
    const { field, order } = params.sort || {};
    const { filter } = params;
    
    let sort = '';
    if (field && order) {
      sort = order === 'ASC' ? field : `-${field}`;
    }
    
    let filterString = '';
    if (filter) {
      const filters = [];
      if (filter.title) {
        filters.push(`title ~ "${filter.title}"`);
      }
      if (filter.description) {
        filters.push(`description ~ "${filter.description}"`);
      }
      if (filter.q) {
        filters.push(`(title ~ "${filter.q}" || description ~ "${filter.q}")`);
      }
      filterString = filters.join(' && ');
    }
    
    const result = await blogService.getList(page, perPage, sort, filterString);
    return {
      data: result.data as any,
      total: result.total,
    };
  },

  getOne: async (resource, params) => {
    if (resource !== 'blogs') return { data: {} as any };
    
    const data = await blogService.getOne(String(params.id));
    return { data: data as any };
  },

  create: async (resource, params) => {
    if (resource !== 'blogs') return { data: {} as any };
    
    const data = await blogService.create({
      title: params.data.title,
      description: params.data.description,
      image_url: params.data.image_url || '',
      video_url: params.data.video_url || '',
      count: params.data.count || 0,
    });
    return { data: data as any };
  },

  update: async (resource, params) => {
    if (resource !== 'blogs') return { data: {} as any };
    
    const data = await blogService.update(String(params.id), {
      title: params.data.title,
      description: params.data.description,
      image_url: params.data.image_url,
      video_url: params.data.video_url,
      count: params.data.count,
    });
    return { data: data as any };
  },

  delete: async (resource, params) => {
    if (resource !== 'blogs') return { data: {} as any };
    
    await blogService.delete(String(params.id));
    return { data: { id: params.id } };
  },

  deleteMany: async (resource, params) => {
    if (resource !== 'blogs') return { data: [] };
    
    const result = await blogService.deleteMany(params.ids.map(String));
    return { data: result.ids };
  },
};