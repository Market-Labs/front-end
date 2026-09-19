const procurementsRoutes = [
  {
    path: '/procurements',
    name: 'procurements',
    component: () => import('./views/procurement-orders.vue'),
    meta: { titleKey: 'option.procurements' },
  },
];

export default procurementsRoutes;
