import { AuthProvider } from 'react-admin';
import pb from './api/pocketbase'; // Import PocketBase instance

const authProvider: AuthProvider = {
  login: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    try {
      const response = await pb
        .collection('users')
        .authWithPassword(email, password);

      localStorage.setItem('username', response?.record?.username);
      localStorage.setItem('avatar', response?.record?.avatar);
      localStorage.setItem('id', response?.record?.id);

      const token = response.token;

      if (token) {
        pb.authStore.save(token); // Save token in PocketBase's auth store
      }
      return Promise.resolve();
    } catch (e) {
      return Promise.reject();
    }
  },
  logout: () => {
    localStorage.removeItem('username');
    return Promise.resolve();
  },
  checkError: () => Promise.resolve(),
  checkAuth: () =>
    localStorage.getItem('username') ? Promise.resolve() : Promise.reject(),
  getPermissions: () => Promise.resolve(),
  getIdentity: () =>
    Promise.resolve({
      id: localStorage.getItem('id') || '',
      fullName: localStorage.getItem('username') || '',
      avatar:
        `https://sensornode.shop/api/files/pbc_3797365305/${localStorage.getItem('id')}/${localStorage.getItem(
          'avatar'
        )}` || '',
    }),
};

export default authProvider;
