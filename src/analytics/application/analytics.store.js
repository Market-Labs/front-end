import { defineStore } from 'pinia';
import { AnalyticsApi } from '../infrastructure/analytics-api.js';
import { OperationalIndicator } from '../domain/model/operational-indicator.entity.js';

const analyticsApi = new AnalyticsApi();

const demoIndicators = [
  new OperationalIndicator({ label: 'Inventario total', currentValue: 1248, previousValue: 1180, unit: 'items' }),
  new OperationalIndicator({ label: 'Mermas registradas', currentValue: 21, previousValue: 28, unit: 'kg' }),
  new OperationalIndicator({ label: 'Ventas por oferta', currentValue: 86, previousValue: 64, unit: 'ops' }),
  new OperationalIndicator({ label: 'Score conservacion', currentValue: 92, previousValue: 88, unit: '%' }),
];

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    indicators: demoIndicators,
    reports: ['Inventario', 'Abastecimiento', 'Mermas', 'Conservacion', 'Proveedores', 'Ventas'],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSummary() {
      this.loading = true;
      try {
        this.indicators = await analyticsApi.getSummary();
      } catch (error) {
        this.error = 'No se pudo cargar analitica. Se muestran datos demo.';
        this.indicators = demoIndicators;
      } finally {
        this.loading = false;
      }
    },
  },
});
