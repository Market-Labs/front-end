import { defineStore } from 'pinia';
import { DashboardOverviewApi } from '../infrastructure/dashboard-overview-api.js';

const overviewApi = new DashboardOverviewApi();

const fallbackOverview = {
  healthScore: 87,
  indicators: [
    { label: 'Inventario', value: '1,248', detail: 'unidades disponibles', icon: 'pi pi-box', route: '/inventory' },
    { label: 'Alertas', value: '4', detail: 'requieren atencion', icon: 'pi pi-bell', route: '/communication' },
    { label: 'Pedidos', value: '3', detail: 'en seguimiento', icon: 'pi pi-truck', route: '/procurements' },
  ],
  activity: [
    { title: 'Lote proximo a vencer', detail: 'Yogurt organico vence en 5 dias.', time: '09:20', kind: 'warning' },
    { title: 'Pedido aceptado', detail: 'Proveedor BioAndes confirmado.', time: '10:45', kind: 'success' },
    { title: 'Sensor actualizado', detail: 'Camara fria dentro del rango.', time: '11:10', kind: 'info' },
  ],
};

export const useDashboardOverviewStore = defineStore('dashboardOverview', {
  state: () => ({
    healthScore: 0,
    indicators: [],
    activity: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchOverview(isSupplier = false) {
      this.loading = true;
      this.error = null;
      try {
        const overview = await overviewApi.getOverview(isSupplier);
        this.healthScore = overview.healthScore;
        this.indicators = overview.indicators;
        this.activity = overview.activity;
      } catch (error) {
        this.error = 'No se pudo cargar el resumen desde la API.';
        this.healthScore = 0;
        this.indicators = [];
        this.activity = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
