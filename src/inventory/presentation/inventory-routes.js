const inventoryRoutes = [
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('./views/inventory-control.vue'),
    meta: { title: 'Inventario' },
  },
];

export default inventoryRoutes;
