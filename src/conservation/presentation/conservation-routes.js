const conservationRoutes = [
  {
    path: '/conservation',
    name: 'conservation',
    component: () => import('./views/conservation-monitoring.vue'),
    meta: { title: 'Conservacion' },
  },
];

export default conservationRoutes;
