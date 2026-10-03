export default [{
  path: '/sales',
  name: 'sales',
  component: () => import('./views/sales-register.vue'),
  meta: { titleKey: 'option.sales', roles: ['admin', 'supplier'] },
}];
