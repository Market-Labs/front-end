const productsRoutes = [
  {
    path: '/products',
    name: 'products',
    component: () => import('./views/product-catalog.vue'),
    meta: { title: 'Productos' },
  },
];

export default productsRoutes;
