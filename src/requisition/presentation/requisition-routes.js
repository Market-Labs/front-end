const requisitionRoutes = [
  {
    path: '/requisition',
    name: 'requisition',
    component: () => import('./views/requisition-board.vue'),
    meta: { title: 'Requisiciones' },
  },
];

export default requisitionRoutes;
