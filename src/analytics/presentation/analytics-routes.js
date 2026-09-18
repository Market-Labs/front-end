const analyticsRoutes = [
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('./views/analytics-summary.vue'),
    meta: { title: 'Analitica' },
  },
];

export default analyticsRoutes;
