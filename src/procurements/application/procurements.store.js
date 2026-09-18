import { defineStore } from 'pinia';
import { ProcurementsApi } from '../infrastructure/procurements-api.js';
import { ProcurementOrder } from '../domain/model/procurement-order.entity.js';

const procurementsApi = new ProcurementsApi();

const demoOrders = [
  new ProcurementOrder({ id: 'ord-1001', supplier: 'BioAndes Organic', minimarket: 'Minimarket Verde Sur', status: 'pending', total: 420.5, createdAt: '2026-09-18', items: ['Yogurt organico', 'Lechuga hidroponica'] }),
  new ProcurementOrder({ id: 'ord-1002', supplier: 'Valle Vivo', minimarket: 'MarketGo Norte', status: 'approved', total: 860, createdAt: '2026-09-17', items: ['Quinua real'] }),
  new ProcurementOrder({ id: 'ord-1003', supplier: 'EcoCampo', minimarket: 'Minimarket Verde Sur', status: 'rejected', total: 210, createdAt: '2026-09-16', items: ['Miel de abeja'] }),
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
  },
});
