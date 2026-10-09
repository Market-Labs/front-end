import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';
import { User } from '../domain/model/user.entity.js';
import { isDemoMode } from '../../shared/infrastructure/demo-mode.js';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firebaseAuth, firestore, isFirebaseMode } from '../../shared/infrastructure/firebase-client.js';
import { UserAssembler } from '../infrastructure/user.assembler.js';

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
    currentUser: isDemoMode ? staticDemoAdmin : isFirebaseMode ? null : demoUsers.find((user) => user.id === (
      window.localStorage.getItem(sessionKey) || window.sessionStorage.getItem(sessionKey)
    )) || null,
    users: isDemoMode ? [staticDemoAdmin] : isFirebaseMode ? [] : demoUsers,
    sessionReady: false,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
    userName: (state) => state.currentUser?.name || 'Invitado',
    userRole: (state) => state.currentUser?.roles?.[0] || 'Sin rol',
    isAdmin: (state) => state.currentUser?.permissions?.includes('users:manage') || false,
    isMinimarketAdmin: (state) => Boolean(state.currentUser?.minimarketId || state.currentUser?.roles?.includes('Administrador de Minimarket')),
    isSupplier: (state) => Boolean(state.currentUser?.supplierId || state.currentUser?.roles?.includes('Proveedor Organico')),
    currentSupplierId: (state) => state.currentUser?.supplierId || (state.currentUser?.roles?.includes('Proveedor Organico') ? 'sup-2' : null),
    currentMinimarketId: (state) => state.currentUser?.minimarketId || (state.currentUser?.tenantId ? null : 'min-1'),
  },
  actions: {
    async restoreSession() {
      if (!isFirebaseMode || this.sessionReady) return;
      await firebaseAuth.authStateReady();
      const uid = firebaseAuth.currentUser?.uid;
      if (uid) {
        try {
          const snapshot = await getDoc(doc(firestore, 'users', uid));
          if (snapshot.exists() && snapshot.data().status === 'active') {
            this.currentUser = UserAssembler.toEntity({ ...snapshot.data(), id: uid });
          } else {
            await signOut(firebaseAuth);
          }
        } catch {
          this.currentUser = null;
        }
      }
      this.sessionReady = true;
    },
    async updateUser(id, changes) {
      const user = await iamApi.updateUser(id, changes);
      this.users = this.users.map((entry) => entry.id === id ? user : entry);
      if (this.currentUser?.id === id) this.currentUser = user;
      return user;
    },
    async createUser({ name, email, password, accessLevel = 'editor' }) {
      if (!this.currentUser?.permissions.includes('users:manage')) throw new Error('access-denied');
      if (!['editor', 'viewer'].includes(accessLevel)) throw new Error('invalid-access-level');
      if (accessLevel === 'editor' && this.currentUser.accessLevel === 'viewer') throw new Error('access-denied');
      const creator = this.currentUser;
      const permissions = accessLevel === 'viewer' ? ['users:manage']
        : this.isSupplier
          ? ['products:write', 'procurements:track', 'users:manage']
          : ['inventory:write', 'procurements:approve', 'users:manage'];
      const user = await iamApi.createUser({
        name: name.trim(), email: email.trim().toLowerCase(), password,
        role: this.isSupplier ? 'supplier' : 'admin',
        roles: [...creator.roles],
        permissions,
        minimarketId: this.isSupplier ? null : creator.minimarketId,
        supplierId: this.isSupplier ? creator.supplierId : null,
        createdBy: creator.id,
        tenantId: creator.tenantId,
        accessLevel,
      });
      this.users.push(user);
      return user;
    },
    async signUp(payload) {
      if (!isFirebaseMode) throw new Error('firebase-required');
      const account = await iamApi.signUp({
        ...payload,
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        businessName: payload.businessName.trim(),
      });
      this.currentUser = account.user;
      this.sessionReady = true;
      return account.user;
    },
    async signIn(email, password, remember = false) {
      if (isDemoMode) return this.currentUser;
      this.error = null;
      const account = await iamApi.signIn({ email: email.trim().toLowerCase(), password, remember });
      const user = isFirebaseMode ? account.user : demoUsers.find((candidate) => candidate.id === account.userId);
      if (!user) throw new Error('invalid-credentials');
      this.currentUser = user;
      if (isFirebaseMode) return user;
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
        this.error = isFirebaseMode ? 'No se pudo cargar usuarios desde Firestore.' : 'No se pudo cargar usuarios desde la API. Se muestran datos demo.';
        this.users = isFirebaseMode ? [] : demoUsers;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      if (isDemoMode) return;
      if (isFirebaseMode) await signOut(firebaseAuth);
      window.localStorage.removeItem('marketgo.auth.token');
      window.localStorage.removeItem(sessionKey);
      window.sessionStorage.removeItem(sessionKey);
      this.currentUser = null;
      if (isFirebaseMode) {
        this.users = [];
        const factories = await Promise.all([
          import('../../analytics/application/analytics.store.js').then((module) => module.useAnalyticsStore),
          import('../../communication/application/communication.store.js').then((module) => module.useCommunicationStore),
          import('../../conservation/application/conservation.store.js').then((module) => module.useConservationStore),
          import('../../dashboard/application/dashboard.store.js').then((module) => module.useDashboardStore),
          import('../../inventory/application/inventory.store.js').then((module) => module.useInventoryStore),
          import('../../procurements/application/procurements.store.js').then((module) => module.useProcurementsStore),
          import('../../products/application/products.store.js').then((module) => module.useProductsStore),
          import('../../profiles/application/profiles.store.js').then((module) => module.useProfilesStore),
          import('../../requisition/application/requisition.store.js').then((module) => module.useRequisitionStore),
          import('../../shared/application/dashboard-overview.store.js').then((module) => module.useDashboardOverviewStore),
          import('../../suppliers/application/suppliers.store.js').then((module) => module.useSuppliersStore),
        ]);
        factories.forEach((factory) => factory().$reset());
      }
    },
  },
});
