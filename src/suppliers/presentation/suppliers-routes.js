const suppliersRoutes = [
  {
    path: '/suppliers',
    name: 'suppliers',
    component: () => import('./views/supplier-directory.vue'),
    meta: { titleKey: 'option.suppliers' },
  },
];

export default suppliersRoutes;
