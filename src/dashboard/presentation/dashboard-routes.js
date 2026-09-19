const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/role-dashboard.vue'),
    meta: { titleKey: 'option.dashboard' },
  },
];

export default dashboardRoutes;
