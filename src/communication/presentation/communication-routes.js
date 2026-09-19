const communicationRoutes = [
  {
    path: '/communication',
    name: 'communication',
    component: () => import('./views/alert-center.vue'),
    meta: { titleKey: 'option.communication' },
  },
];

export default communicationRoutes;
