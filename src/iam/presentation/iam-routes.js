const iamRoutes = [
  {
    path: '/iam',
    name: 'iam',
    component: () => import('./views/users-access.vue'),
    meta: { title: 'Usuarios y roles' },
  },
];

export default iamRoutes;
