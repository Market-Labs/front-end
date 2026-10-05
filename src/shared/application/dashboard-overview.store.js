import { defineStore } from 'pinia';
import { DashboardOverviewApi } from '../infrastructure/dashboard-overview-api.js';
import { isFirebaseMode } from '../infrastructure/firebase-client.js';

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
    healthScore: isFirebaseMode ? 0 : fallbackOverview.healthScore,
    indicators: isFirebaseMode ? [] : fallbackOverview.indicators,
    activity: isFirebaseMode ? [] : fallbackOverview.activity,
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
        this.error = isFirebaseMode ? 'No se pudo cargar el resumen desde Firestore.' : 'Fake API no disponible. Se muestran datos locales.';
        this.healthScore = isSupplier || isFirebaseMode ? 0 : fallbackOverview.healthScore;
        this.indicators = isSupplier || isFirebaseMode ? [] : fallbackOverview.indicators;
        this.activity = isSupplier || isFirebaseMode ? [] : fallbackOverview.activity;
      } finally {
        this.loading = false;
      }
    },
  },
});
