const inventoryRoutes = [
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('./views/inventory-control.vue'),
    meta: { titleKey: 'option.inventory' },
  },
];

export default inventoryRoutes;
