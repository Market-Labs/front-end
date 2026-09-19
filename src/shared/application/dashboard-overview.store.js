import { defineStore } from 'pinia';
import { DashboardOverviewApi } from '../infrastructure/dashboard-overview-api.js';

const overviewApi = new DashboardOverviewApi();

const fallbackOverview = {
  healthScore: 87,
  indicators: [
    { label: 'Inventario', value: '1,248', detail: 'unidades disponibles', icon: 'pi pi-box', route: '/inventory' },
    { label: 'Alertas', value: '1', detail: 'requiere atencion', icon: 'pi pi-bell', route: '/communication' },
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
    healthScore: fallbackOverview.healthScore,
    indicators: fallbackOverview.indicators,
    activity: fallbackOverview.activity,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchOverview() {
      this.loading = true;
      this.error = null;
      try {
        const overview = await overviewApi.getOverview();
        this.healthScore = overview.healthScore;
        this.indicators = overview.indicators;
        this.activity = overview.activity;
      } catch (error) {
        this.error = 'Fake API no disponible. Se muestran datos locales.';
        this.healthScore = fallbackOverview.healthScore;
        this.indicators = fallbackOverview.indicators;
        this.activity = fallbackOverview.activity;
      } finally {
        this.loading = false;
      }
    },
  },
});
