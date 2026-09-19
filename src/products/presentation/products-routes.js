const productsRoutes = [
  {
    path: '/products',
    name: 'products',
    component: () => import('./views/product-catalog.vue'),
    meta: { titleKey: 'option.products' },
  },
];

export default productsRoutes;
