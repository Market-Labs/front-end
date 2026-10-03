import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';
import { User } from '../domain/model/user.entity.js';
import { isDemoMode } from '../../shared/infrastructure/demo-mode.js';

const iamApi = new IamApi();
const sessionKey = 'marketgo.auth.userId';

const demoUsers = [
  new User({
    id: 'usr-admin',
    name: 'Albino Caceres',
    email: 'admi@marketgo.com',
    status: 'active',
    roles: ['Administrador de Minimarket'],
    permissions: ['inventory:write', 'procurements:approve', 'users:manage'],
  }),
  new User({
    id: 'usr-provider',
    name: 'Anita Gamboa',
    email: 'proveedor@marketgo.com',
    status: 'active',
    roles: ['Proveedor Organico'],
    permissions: ['products:write', 'procurements:track'],
  }),
];

const staticDemoAdmin = new User({
  id: 'usr-admin',
  name: 'Administrador Demo',
  email: 'contacto@example.invalid',
  status: 'active',
  roles: ['Administrador de Minimarket'],
  permissions: ['inventory:write', 'procurements:approve', 'users:manage'],
});

export const useIamStore = defineStore('iam', {
  state: () => ({
    currentUser: isDemoMode ? staticDemoAdmin : demoUsers.find((user) => user.id === (
      window.localStorage.getItem(sessionKey) || window.sessionStorage.getItem(sessionKey)
    )) || null,
    users: isDemoMode ? [staticDemoAdmin] : demoUsers,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
    userName: (state) => state.currentUser?.name || 'Invitado',
    userRole: (state) => state.currentUser?.roles?.[0] || 'Sin rol',
    isAdmin: (state) => state.currentUser?.permissions?.includes('users:manage') || false,
    isMinimarketAdmin: (state) => state.currentUser?.roles?.includes('Administrador de Minimarket') || false,
    isSupplier: (state) => state.currentUser?.roles?.includes('Proveedor Organico') || false,
    currentSupplierId: (state) => (state.currentUser?.roles?.includes('Proveedor Organico') ? 'sup-2' : null),
    currentMinimarketId: (state) => (state.currentUser?.roles?.includes('Administrador de Minimarket') ? 'min-1' : 'min-1'),
  },
  actions: {
    async updateUser(id, changes) {
      const user = await iamApi.updateUser(id, changes);
      this.users = this.users.map((entry) => entry.id === id ? user : entry);
      if (this.currentUser?.id === id) this.currentUser = user;
      return user;
    },
    async signIn(email, password, remember = false) {
      if (isDemoMode) return this.currentUser;
      this.error = null;
      const account = await iamApi.signIn({ email: email.trim().toLowerCase(), password });
      const user = demoUsers.find((candidate) => candidate.id === account.userId);
      if (!user) throw new Error('invalid-credentials');
      this.currentUser = user;
      window.localStorage.removeItem(sessionKey);
      window.sessionStorage.removeItem(sessionKey);
      const storage = remember ? window.localStorage : window.sessionStorage;
      storage.setItem(sessionKey, user.id);
      return user;
    },
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
      if (isDemoMode) return;
      window.localStorage.removeItem('marketgo.auth.token');
      window.localStorage.removeItem(sessionKey);
      window.sessionStorage.removeItem(sessionKey);
      this.currentUser = null;
    },
  },
});
