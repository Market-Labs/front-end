const communicationRoutes = [
  {
    path: '/communication',
    name: 'communication',
    component: () => import('./views/alert-center.vue'),
    meta: { title: 'Comunicacion' },
  },
];

export default communicationRoutes;
