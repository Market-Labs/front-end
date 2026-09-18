const suppliersRoutes = [
  {
    path: '/suppliers',
    name: 'suppliers',
    component: () => import('./views/supplier-directory.vue'),
    meta: { title: 'Proveedores' },
  },
];

export default suppliersRoutes;
