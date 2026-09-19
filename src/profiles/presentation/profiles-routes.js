const profilesRoutes = [
  {
    path: '/profiles',
    name: 'profiles',
    component: () => import('./views/profile-management.vue'),
    meta: { titleKey: 'option.profiles' },
  },
];

export default profilesRoutes;
