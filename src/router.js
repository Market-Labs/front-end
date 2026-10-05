import { createRouter, createWebHistory } from 'vue-router';
import iamRoutes from './iam/presentation/iam-routes.js';
import profilesRoutes from './profiles/presentation/profiles-routes.js';
import dashboardRoutes from './dashboard/presentation/dashboard-routes.js';
import analyticsRoutes from './analytics/presentation/analytics-routes.js';
import inventoryRoutes from './inventory/presentation/inventory-routes.js';
import productsRoutes from './products/presentation/products-routes.js';
import requisitionRoutes from './requisition/presentation/requisition-routes.js';
import procurementsRoutes from './procurements/presentation/procurements-routes.js';
import suppliersRoutes from './suppliers/presentation/suppliers-routes.js';
import conservationRoutes from './conservation/presentation/conservation-routes.js';
import communicationRoutes from './communication/presentation/communication-routes.js';
import salesRoutes from './sales/presentation/sales-routes.js';
import i18n from './i18n.js';
import pinia from './pinia.js';
import { useIamStore } from './iam/application/iam.store.js';
import { isDemoMode } from './shared/infrastructure/demo-mode.js';
import { isFirebaseMode } from './shared/infrastructure/firebase-client.js';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('./iam/presentation/views/sign-in.vue'),
    meta: { public: true, titleKey: 'auth.signIn' },
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('./iam/presentation/views/forgot-password.vue'),
    meta: { public: true, titleKey: 'auth.forgotPassword' },
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./shared/presentation/views/dashboard-shell.vue'),
    meta: { titleKey: 'option.dashboard' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./shared/presentation/views/settings.vue'),
    meta: { titleKey: 'option.settings' },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('./shared/presentation/views/access-denied.vue'),
    meta: { titleKey: 'page.accessDenied.title' },
  },
  ...iamRoutes,
  ...profilesRoutes,
  ...dashboardRoutes,
  ...analyticsRoutes,
  ...inventoryRoutes,
  ...productsRoutes,
  ...requisitionRoutes,
  ...procurementsRoutes,
  ...suppliersRoutes,
  ...conservationRoutes,
  ...communicationRoutes,
  ...salesRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const iamStore = useIamStore(pinia);
  if (isDemoMode && to.meta.public) return { name: 'home' };
  if (isFirebaseMode) await iamStore.restoreSession();
  if (!to.meta.public && !iamStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
  if (to.meta.public && iamStore.isAuthenticated) return { name: 'home' };
  if (to.meta.roles && !to.meta.roles.some((role) => (
    role === 'admin' ? iamStore.isMinimarketAdmin : iamStore.isSupplier
  ))) return { name: 'access-denied' };
  const title = to.meta.titleKey ? i18n.global.t(to.meta.titleKey) : to.meta.title || 'App';
  document.title = `MarketGo - ${title}`;
});

export default router;
