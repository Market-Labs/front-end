const communicationRoutes = [
  {
    path: '/communication',
    name: 'communication',
    component: () => import('./views/alert-center.vue'),
    meta: { title: 'Alertas' },
  },
];

export default communicationRoutes;
