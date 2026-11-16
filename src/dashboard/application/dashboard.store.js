import { defineStore } from 'pinia';
import { DashboardApi } from '../infrastructure/dashboard-api.js';

const dashboardApi = new DashboardApi();

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    indicators: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchIndicators(isSupplier = false) {
      this.loading = true;
      this.error = null;
      try {
        this.indicators = await dashboardApi.getIndicators(isSupplier);
      } catch (error) {
        this.error = 'No se pudo cargar el dashboard desde la API.';
        this.indicators = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
