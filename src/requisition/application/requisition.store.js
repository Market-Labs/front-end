import { defineStore } from 'pinia';
import { RequisitionApi } from '../infrastructure/requisition-api.js';
import { Requisition } from '../domain/model/requisition.entity.js';

const requisitionApi = new RequisitionApi();

const demoRequisitions = [
  new Requisition({ id: 'req-1', requester: 'Albino Caceres', productName: 'Yogurt organico', quantity: 24, reason: 'Reposicion por venta rapida', status: 'pending', createdAt: '2026-09-18' }),
  new Requisition({ id: 'req-2', requester: 'Albino Caceres', productName: 'Leche organica', quantity: 30, reason: 'Demanda semanal de lacteos', status: 'approved', createdAt: '2026-09-18' }),
  new Requisition({ id: 'req-3', requester: 'Albino Caceres', productName: 'Tomate organico', quantity: 45, reason: 'Reposicion para anaquel principal', status: 'pending', createdAt: '2026-09-17' }),
  new Requisition({ id: 'req-4', requester: 'Albino Caceres', productName: 'Queso organico', quantity: 15, reason: 'Stock minimo alcanzado', status: 'rejected', createdAt: '2026-09-16' }),
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
