const profilesRoutes = [
  {
    path: '/profiles',
    name: 'profiles',
    component: () => import('./views/profile-management.vue'),
    meta: { titleKey: 'option.contacts' },
  },
  {
    path: '/clients',
    name: 'clients',
    component: () => import('./views/client-directory.vue'),
    meta: { titleKey: 'option.clients', roles: ['supplier'] },
  },
];

export default profilesRoutes;
