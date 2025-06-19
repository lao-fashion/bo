import pb from './pocketbase';

export interface Blog {
  collectionId: string;
  collectionName: string;
  id: string;
  image_url: string;
  title: string;
  description: string;
  video_url: string;
  count: number;
  created: string;
  updated: string;
}

export const blogService = {
  async getList(page = 1, perPage = 10, sort = '-created', filter = '') {
    const options: any = {
      page,
      perPage,
      sort,
    };
    
    if (filter) {
      options.filter = filter;
    }

    const result = await pb.collection('blogs').getList<Blog>(page, perPage, options);
    return {
      data: result.items,
      total: result.totalItems,
    };
  },

  async getOne(id: string) {
    return await pb.collection('blogs').getOne<Blog>(id);
  },

  async create(data: Partial<Blog>) {
    const result = await pb.collection('blogs').create<Blog>(data);
    return result;
  },

  async update(id: string, data: Partial<Blog>) {
    const result = await pb.collection('blogs').update<Blog>(id, data);
    return result;
  },

  async delete(id: string) {
    await pb.collection('blogs').delete(id);
    return { id };
  },

  async deleteMany(ids: string[]) {
    const deletedIds = [];
    for (const id of ids) {
      try {
        await pb.collection('blogs').delete(id);
        deletedIds.push(id);
      } catch (error) {
        console.error(`Failed to delete blog ${id}:`, error);
      }
    }
    return { ids: deletedIds };
  },
};