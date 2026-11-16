import { defineStore } from 'pinia';
import { ProfilesApi } from '../infrastructure/profiles-api.js';
import { useIamStore } from '../../iam/application/iam.store.js';

const profilesApi = new ProfilesApi();

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
