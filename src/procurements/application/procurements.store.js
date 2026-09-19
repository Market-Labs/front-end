import { defineStore } from 'pinia';
import { ProcurementsApi } from '../infrastructure/procurements-api.js';
import { ProcurementOrder } from '../domain/model/procurement-order.entity.js';

const procurementsApi = new ProcurementsApi();

const demoOrders = [
  new ProcurementOrder({ id: 'ord-1001', supplier: 'BioAndes Organic', minimarket: 'Minimarket Verde Sur', status: 'pending', total: 420.5, createdAt: '2026-09-18', items: ['Yogurt organico', 'Lechugas organicas'] }),
  new ProcurementOrder({ id: 'ord-1002', supplier: 'Anita Gamboa', minimarket: 'Minimarket Verde Sur', status: 'pending', total: 315.8, createdAt: '2026-09-18', items: ['Leche organica', 'Queso organico'] }),
  new ProcurementOrder({ id: 'ord-1003', supplier: 'BioAndes Organic', minimarket: 'Minimarket Verde Sur', status: 'approved', total: 228.4, createdAt: '2026-09-17', items: ['Tomate organico', 'Pepino organico', 'Zanahoria organica'] }),
];

export const useProcurementsStore = defineStore('procurements', {
  state: () => ({
    orders: demoOrders,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        this.orders = await procurementsApi.getOrders();
      } catch (error) {
        this.error = 'No se pudo cargar abastecimientos. Se muestran datos demo.';
        this.orders = demoOrders;
      } finally {
        this.loading = false;
      }
    },
    addDemoOrder() {
      const next = this.orders.length + 1;
      this.orders = [
        new ProcurementOrder({
          id: `ord-demo-${1000 + next}`,
          supplier: 'Anita Gamboa',
          minimarket: 'Minimarket Verde Sur',
          status: 'pending',
          total: 315.8,
          createdAt: '2026-09-18',
          items: ['Leche organica', 'Queso organico'],
        }),
        ...this.orders,
      ];
    },
  },
});
