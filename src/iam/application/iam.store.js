import { defineStore } from 'pinia';
import { IamApi } from '../infrastructure/iam-api.js';
import { isAdministrator } from '../domain/model/access-role.js';
import { clearSessionToken, isTokenExpired, saveSessionToken, sessionToken, setApiUser } from '../../shared/infrastructure/api-session.js';

const iamApi = new IamApi();
const resetModules = async () => {
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
};

export const useIamStore = defineStore('iam', {
  state: () => ({ currentUser: null, users: [], sessionReady: false, loading: false, error: null }),
  getters: {
    isAuthenticated: (state) => Boolean(state.currentUser),
    userName: (state) => state.currentUser?.name || 'Invitado',
    userRole: (state) => state.currentUser?.roles?.[0] || 'Sin rol',
    isAdmin: (state) => isAdministrator(state.currentUser?.accessLevel),
    isMinimarketAdmin: (state) => state.currentUser?.accountType === 'minimarket',
    isSupplier: (state) => state.currentUser?.accountType === 'supplier',
    currentSupplierId: (state) => state.currentUser?.accountType === 'supplier' ? state.currentUser.organizationId : null,
    currentMinimarketId: (state) => state.currentUser?.accountType === 'minimarket' ? state.currentUser.organizationId : null,
  },
  actions: {
    async restoreSession() {
      if (this.sessionReady) return;
      const token = sessionToken();
      if (!token || isTokenExpired(token)) {
        clearSessionToken();
        this.sessionReady = true;
        return;
      }
      try {
        this.currentUser = await iamApi.me();
        setApiUser(this.currentUser);
      } catch {
        clearSessionToken();
        this.currentUser = null;
        setApiUser(null);
      } finally {
        this.sessionReady = true;
      }
    },
    async signIn(email, password, remember = false) {
      try {
        const account = await iamApi.signIn({ email: email.trim().toLowerCase(), password });
        if (!account.token || !account.user?.organizationId) throw new Error('invalid-session');
        saveSessionToken(account.token, remember);
        setApiUser(account.user);
        this.currentUser = account.user;
        this.sessionReady = true;
        return account.user;
      } catch (error) {
        if (error.response?.status === 401) throw new Error('invalid-credentials');
        throw error;
      }
    },
    async signUp(payload) {
      const account = await iamApi.signUp({
        ...payload, name: payload.name.trim(), email: payload.email.trim().toLowerCase(),
        businessName: payload.businessName.trim(),
      });
      if (!account.token || !account.user?.organizationId) throw new Error('invalid-session');
      saveSessionToken(account.token, false);
      setApiUser(account.user);
      this.currentUser = account.user;
      this.sessionReady = true;
      return account.user;
    },
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try { this.users = await iamApi.getUsers(); }
      catch { this.users = []; this.error = 'No se pudo cargar usuarios desde la API.'; }
      finally { this.loading = false; }
    },
    async createUser() { throw new Error('backend-feature-unavailable:collaborators'); },
    async updateUser() { throw new Error('backend-feature-unavailable:collaborators'); },
    async logout() {
      clearSessionToken();
      setApiUser(null);
      this.currentUser = null;
      this.users = [];
      await resetModules();
    },
  },
});
