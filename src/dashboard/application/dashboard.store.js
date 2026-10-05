import { defineStore } from 'pinia';
import { DashboardApi } from '../infrastructure/dashboard-api.js';
import { DashboardIndicator } from '../domain/model/dashboard-indicator.entity.js';
import { isFirebaseMode } from '../../shared/infrastructure/firebase-client.js';

const dashboardApi = new DashboardApi();

const demoIndicators = [
  new DashboardIndicator({ title: 'Stock disponible', type: 'inventory', value: 1248, variation: 8 }),
  new DashboardIndicator({ title: 'Requisiciones', type: 'requisition', value: 18, variation: 3 }),
  new DashboardIndicator({ title: 'Abastecimientos', type: 'procurements', value: 32, variation: 12 }),
  new DashboardIndicator({ title: 'Alertas activas', type: 'alerts', value: 4, variation: -2, severity: 'warning' }),
];

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    indicators: isFirebaseMode ? [] : demoIndicators,
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
        this.error = isFirebaseMode ? 'No se pudo cargar el dashboard desde Firestore.' : 'No se pudo cargar el dashboard desde la API. Se muestran datos demo.';
        this.indicators = isSupplier || isFirebaseMode ? [] : demoIndicators;
      } finally {
        this.loading = false;
      }
    },
  },
});
