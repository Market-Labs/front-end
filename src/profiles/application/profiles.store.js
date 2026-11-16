import { defineStore } from 'pinia';
import { ProfilesApi } from '../infrastructure/profiles-api.js';
import { useIamStore } from '../../iam/application/iam.store.js';
import { Profile } from '../domain/model/profile.entity.js';

const profilesApi = new ProfilesApi();

const demoProfiles = [
  new Profile({
    id: 'prof-market',
    userId: 'usr-admin',
    type: 'minimarket',
    businessName: 'Minimarket Verde Sur',
    email: 'admi@marketgo.com',
    phone: '+51 987 654 321',
    address: 'Av. Los Alimentos 120',
    district: 'Surco',
  }),
  new Profile({
    id: 'prof-provider',
    userId: 'usr-provider',
    type: 'provider',
    businessName: 'Anita Gamboa',
    email: 'proveedor@marketgo.com',
    phone: '+51 955 222 110',
    address: 'Cerro Colorado, Arequipa',
    specialty: 'Lacteos y derivados',
    coverageArea: 'Cerro Colorado - Arequipa',
  }),
];

export const useProfilesStore = defineStore('profiles', {
  state: () => ({
    profiles: [],
    loading: false,
    error: null,
  }),
  actions: {
    async createContact(payload) {
      const created = await profilesApi.createProfile(payload);
      this.profiles.push(created);
      return created;
    },
    async fetchProfiles() {
      this.loading = true;
      this.error = null;
      try {
        this.profiles = await profilesApi.getProfiles();
        const own = this.profiles.find((profile) => profile.organizationId === useIamStore().currentUser?.organizationId);
        if (own) {
          const detail = await profilesApi.getProfile(own.id);
          this.profiles = this.profiles.map((profile) => profile.id === own.id ? detail : profile);
        }
      } catch (error) {
        this.error = 'No se pudo cargar contactos desde la API.';
        this.profiles = [];
      } finally {
        this.loading = false;
      }
    },
    async updateContact(id, payload) {
      const updated = await profilesApi.updateProfile(id, payload);
      this.profiles = this.profiles.map((profile) => profile.id === id ? updated : profile);
      return updated;
    },
  },
});
