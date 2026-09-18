const procurementsRoutes = [
  {
    path: '/procurements',
    name: 'procurements',
    component: () => import('./views/procurement-orders.vue'),
    meta: { title: 'Abastecimiento' },
  },
];

export default procurementsRoutes;
