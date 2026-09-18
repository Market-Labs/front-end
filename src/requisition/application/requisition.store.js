import { defineStore } from 'pinia';
import { RequisitionApi } from '../infrastructure/requisition-api.js';
import { Requisition } from '../domain/model/requisition.entity.js';

const requisitionApi = new RequisitionApi();

const demoRequisitions = [
  new Requisition({ id: 'req-1', requester: 'Ana Mercado', productName: 'Yogurt organico', quantity: 24, reason: 'Reposicion por venta rapida', status: 'pending', createdAt: '2026-09-18' }),
  new Requisition({ id: 'req-2', requester: 'Carlos Tienda', productName: 'Quinua real', quantity: 40, reason: 'Campana saludable', status: 'approved', createdAt: '2026-09-17' }),
  new Requisition({ id: 'req-3', requester: 'Maria Stock', productName: 'Miel de abeja', quantity: 12, reason: 'Bajo stock', status: 'rejected', createdAt: '2026-09-16' }),
];

export const useRequisitionStore = defineStore('requisition', {
  state: () => ({
    requisitions: demoRequisitions,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchRequisitions() {
      this.loading = true;
      try {
        this.requisitions = await requisitionApi.getRequisitions();
      } catch (error) {
        this.error = 'No se pudo cargar requisiciones. Se muestran datos demo.';
        this.requisitions = demoRequisitions;
      } finally {
        this.loading = false;
      }
    },
  },
});
