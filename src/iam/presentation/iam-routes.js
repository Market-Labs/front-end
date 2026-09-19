const iamRoutes = [
  {
    path: '/iam',
    name: 'iam',
    component: () => import('./views/users-access.vue'),
    meta: { titleKey: 'option.iam' },
  },
];

export default iamRoutes;
