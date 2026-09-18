import { defineStore } from 'pinia';
import { ProfilesApi } from '../infrastructure/profiles-api.js';
import { Profile } from '../domain/model/profile.entity.js';

const profilesApi = new ProfilesApi();

const demoProfiles = [
  new Profile({
    id: 'prof-market',
    userId: 'usr-admin',
    type: 'minimarket',
    businessName: 'Minimarket Verde Sur',
    phone: '+51 987 654 321',
    address: 'Av. Los Alimentos 120',
    district: 'Surco',
  }),
  new Profile({
    id: 'prof-provider',
    userId: 'usr-provider',
    type: 'provider',
    businessName: 'BioAndes Organic',
    phone: '+51 955 222 110',
    address: 'Ruta Agricola 45',
    specialty: 'Lacteos y vegetales organicos',
    coverageArea: 'Lima Metropolitana',
  }),
];

export const useProfilesStore = defineStore('profiles', {
  state: () => ({
    profiles: demoProfiles,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProfiles() {
      this.loading = true;
      this.error = null;
      try {
        this.profiles = await profilesApi.getProfiles();
      } catch (error) {
        this.error = 'No se pudo conectar con perfiles. Se muestran datos demo.';
        this.profiles = demoProfiles;
      } finally {
        this.loading = false;
      }
    },
  },
});
