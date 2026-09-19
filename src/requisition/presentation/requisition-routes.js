const requisitionRoutes = [
  {
    path: '/requisition',
    name: 'requisition',
    component: () => import('./views/requisition-board.vue'),
    meta: { titleKey: 'option.requisition' },
  },
];

export default requisitionRoutes;
