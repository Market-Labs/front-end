const profilesRoutes = [
  {
    path: '/profiles',
    name: 'profiles',
    component: () => import('./views/profile-management.vue'),
    meta: { title: 'Perfiles' },
  },
];

export default profilesRoutes;
