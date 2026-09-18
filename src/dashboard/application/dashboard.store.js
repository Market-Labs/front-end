import { defineStore } from 'pinia';
import { DashboardApi } from '../infrastructure/dashboard-api.js';
import { DashboardIndicator } from '../domain/model/dashboard-indicator.entity.js';

const dashboardApi = new DashboardApi();

const demoIndicators = [
  new DashboardIndicator({ title: 'Stock disponible', type: 'inventory', value: 1248, variation: 8 }),
  new DashboardIndicator({ title: 'Requisiciones', type: 'requisition', value: 18, variation: 3 }),
  new DashboardIndicator({ title: 'Abastecimientos', type: 'procurements', value: 32, variation: 12 }),
  new DashboardIndicator({ title: 'Alertas activas', type: 'alerts', value: 14, variation: -2, severity: 'warning' }),
];

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    indicators: demoIndicators,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchIndicators() {
      this.loading = true;
      this.error = null;
      try {
        this.indicators = await dashboardApi.getIndicators();
      } catch (error) {
        this.error = 'No se pudo cargar el dashboard desde la API. Se muestran datos demo.';
        this.indicators = demoIndicators;
      } finally {
        this.loading = false;
      }
    },
  },
});
