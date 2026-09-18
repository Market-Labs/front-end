import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';
import { User } from '../domain/model/user.entity.js';

const iamApi = new IamApi();

const demoUsers = [
  new User({
    id: 'usr-admin',
    name: 'Ana Mercado',
    email: 'ana@marketgo.pe',
    roles: ['Administrador minimarket'],
    permissions: ['inventory:write', 'procurements:approve', 'users:manage'],
  }),
  new User({
    id: 'usr-provider',
    name: 'Luis Proveedor',
    email: 'luis@bioandes.pe',
    roles: ['Proveedor organico'],
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
