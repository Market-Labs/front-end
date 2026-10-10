const conservationRoutes = [
  {
    path: '/conservation',
    name: 'conservation',
    component: () => import('./views/conservation-monitoring.vue'),
    meta: { titleKey: 'option.conservation' },
  },
];

export default conservationRoutes;
