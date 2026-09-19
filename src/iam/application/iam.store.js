import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';
import { User } from '../domain/model/user.entity.js';

const iamApi = new IamApi();

const demoUsers = [
  new User({
    id: 'usr-admin',
    name: 'Albino Caceres',
    email: 'albinoca@marketgo.pe',
    status: 'active',
    roles: ['Administrador de Minimarket'],
    permissions: ['inventory:write', 'procurements:approve', 'users:manage'],
  }),
  new User({
    id: 'usr-provider',
    name: 'Anita Gamboa',
    email: 'anitaG@bioandes.pe',
    status: 'active',
    roles: ['Proveedor Organico'],
    permissions: ['products:write', 'procurements:track'],
  }),
];

export const useIamStore = defineStore('iam', {
  state: () => ({
    currentUser: demoUsers[0],
    users: demoUsers,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
    userName: (state) => state.currentUser?.name || 'Invitado',
    userRole: (state) => state.currentUser?.roles?.[0] || 'Sin rol',
    isAdmin: (state) => state.currentUser?.permissions?.includes('users:manage') || false,
  },
  actions: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        this.users = await iamApi.getUsers();
      } catch (error) {
        this.error = 'No se pudo cargar usuarios desde la API. Se muestran datos demo.';
        this.users = demoUsers;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      window.localStorage.removeItem('marketgo.auth.token');
      this.currentUser = null;
    },
  },
});
