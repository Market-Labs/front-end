import { defineStore } from 'pinia';
import { ConservationApi } from '../infrastructure/conservation-api.js';

const conservationApi = new ConservationApi();

export const useConservationStore = defineStore('conservation', {
  state: () => ({
    records: [],
    loading: false,
    error: null,
  }),
  getters: {
    riskCount: (state) => state.records.filter((record) => record.isRisky).length,
  },
  actions: {
    async fetchMonitoring(isSupplier = false) {
      this.loading = true;
      try {
        this.records = await conservationApi.getMonitoring(isSupplier);
      } catch (error) {
        this.error = 'No se pudo cargar monitoreo desde la API.';
        this.records = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
