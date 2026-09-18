const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('./views/role-dashboard.vue'),
    meta: { title: 'Dashboard' },
  },
];

export default dashboardRoutes;
