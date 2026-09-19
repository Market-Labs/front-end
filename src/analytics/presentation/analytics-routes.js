const analyticsRoutes = [
  {
    path: '/analytics',
    name: 'analytics',
    component: () => import('./views/analytics-summary.vue'),
    meta: { titleKey: 'option.analytics' },
  },
];

export default analyticsRoutes;
