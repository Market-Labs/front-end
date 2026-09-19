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

const demoReportSummaries = {
  Inventario: {
    title: 'Inventario',
    description: 'Stock disponible, productos en riesgo y vencimientos cercanos.',
    metrics: [
      { label: 'Productos en stock', value: '10' },
      { label: 'Unidades disponibles', value: '1,248' },
      { label: 'Lotes en riesgo', value: '1' },
    ],
    highlights: ['Yogurt organico requiere reposicion.', 'Leche organica vence el 24 de setiembre.', 'Lechugas organicas mantienen stock saludable.'],
  },
  Abastecimiento: {
    title: 'Abastecimiento',
    description: 'Ordenes de compra y seguimiento de proveedores.',
    metrics: [
      { label: 'Ordenes activas', value: '3' },
      { label: 'Pendientes', value: '2' },
      { label: 'Monto total', value: 'S/ 964.70' },
    ],
    highlights: ['Anita Gamboa tiene orden pendiente.', 'BioAndes Organic confirmo una orden.', 'Lacteos concentran la mayor demanda.'],
  },
  Mermas: {
    title: 'Mermas',
    description: 'Perdidas registradas por vencimiento, conservacion y manipulacion.',
    metrics: [
      { label: 'Merma total', value: '21 kg' },
      { label: 'Reduccion mensual', value: '25%' },
      { label: 'Producto critico', value: 'Yogurt' },
    ],
    highlights: ['La merma bajo frente al periodo anterior.', 'Los lacteos concentran mayor riesgo.', 'Se recomienda rotacion FEFO diaria.'],
  },
  Conservacion: {
    title: 'Conservacion',
    description: 'Temperatura, humedad y alertas por zona de almacenamiento.',
    metrics: [
      { label: 'Score', value: '92%' },
      { label: 'Alertas activas', value: '1' },
      { label: 'Zonas monitoreadas', value: '2' },
    ],
    highlights: ['Camara fria A esta dentro del rango.', 'Anaquel fresco presenta humedad elevada.', 'Yogurt organico se mantiene a 4 C.'],
  },
  Proveedores: {
    title: 'Proveedores',
    description: 'Directorio, cobertura y participacion en ordenes.',
    metrics: [
      { label: 'Proveedores activos', value: '2' },
      { label: 'Zona destacada', value: 'Arequipa' },
      { label: 'Especialidad lider', value: 'Lacteos' },
    ],
    highlights: ['Anita Gamboa cubre Cerro Colorado - Arequipa.', 'BioAndes Organic atiende lacteos y vegetales.', 'Hay proveedores con ordenes pendientes.'],
  },
  Ventas: {
    title: 'Ventas',
    description: 'Operaciones por oferta y productos con mayor movimiento.',
    metrics: [
      { label: 'Ventas por oferta', value: '86 ops' },
      { label: 'Crecimiento', value: '34%' },
      { label: 'Categoria fuerte', value: 'Vegetales' },
    ],
    highlights: ['Tomate y lechugas tienen alta rotacion.', 'Las ofertas organicas elevan operaciones.', 'Manzanas mantienen disponibilidad saludable.'],
  },
};

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    indicators: demoIndicators,
    reports: ['Inventario', 'Abastecimiento', 'Mermas', 'Conservacion', 'Proveedores', 'Ventas'],
    reportSummaries: demoReportSummaries,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSummary() {
      this.loading = true;
      try {
        const summary = await analyticsApi.getSummary();
        this.indicators = summary.indicators;
        this.reportSummaries = { ...demoReportSummaries, ...summary.reportSummaries };
      } catch (error) {
        this.error = 'No se pudo cargar analitica. Se muestran datos demo.';
        this.indicators = demoIndicators;
        this.reportSummaries = demoReportSummaries;
      } finally {
        this.loading = false;
      }
    },
  },
});
