const iamRoutes = [
  {
    path: '/iam',
    name: 'iam',
    component: () => import('./views/users-access.vue'),
    meta: { titleKey: 'option.iam', roles: ['admin', 'supplier'] },
  },
];

export default iamRoutes;
