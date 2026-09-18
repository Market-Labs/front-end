import { createRouter, createWebHistory } from 'vue-router';
import iamRoutes from './iam/presentation/iam-routes.js';
import profilesRoutes from './profiles/presentation/profiles-routes.js';
import dashboardRoutes from './dashboard/presentation/dashboard-routes.js';
import analyticsRoutes from './analytics/presentation/analytics-routes.js';
import inventoryRoutes from './inventory/presentation/inventory-routes.js';
import productsRoutes from './products/presentation/products-routes.js';
import requisitionRoutes from './requisition/presentation/requisition-routes.js';
import procurementsRoutes from './procurements/presentation/procurements-routes.js';

const featurePlaceholder = () => import('./shared/presentation/views/feature-placeholder.vue');

const featureRoutes = [
  ['analytics', 'Analitica'],
  ['communication', 'Comunicacion'],
  ['conservation', 'Conservacion'],
  ['dashboard', 'Dashboard'],
  ['iam', 'Usuarios y roles'],
  ['inventory', 'Inventario'],
  ['procurements', 'Abastecimiento'],
  ['products', 'Productos'],
  ['profiles', 'Perfiles'],
  ['requisition', 'Requisiciones'],
  ['suppliers', 'Proveedores'],
].map(([path, title]) => ({
  path: `/${path}`,
  name: path,
  component: featurePlaceholder,
  props: { title, context: path },
  meta: { title },
}));

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('./shared/presentation/views/dashboard-shell.vue'),
    meta: { title: 'Dashboard' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./shared/presentation/views/settings.vue'),
    meta: { title: 'Configuracion' },
  },
  {
    path: '/access-denied',
    name: 'access-denied',
    component: () => import('./shared/presentation/views/access-denied.vue'),
    meta: { title: 'Acceso denegado' },
  },
  ...iamRoutes,
  ...profilesRoutes,
  ...dashboardRoutes,
  ...analyticsRoutes,
  ...inventoryRoutes,
  ...productsRoutes,
  ...requisitionRoutes,
  ...procurementsRoutes,
  ...featureRoutes,
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home',
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  document.title = `MarketGo - ${to.meta.title || 'App'}`;
});

export default router;
