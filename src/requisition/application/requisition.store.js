import { defineStore } from 'pinia';
import { RequisitionApi } from '../infrastructure/requisition-api.js';
import { Requisition } from '../domain/model/requisition.entity.js';

const requisitionApi = new RequisitionApi();

const demoRequisitions = [
  new Requisition({ id: 'req-1', minimarketId: 'min-1', supplierId: 'sup-2', requester: 'Albino Caceres', supplier: 'Anita Gamboa', productName: 'Yogurt organico', quantity: 24, reason: 'Reposicion por venta rapida', status: 'pending', createdAt: '2026-09-18', items: [{ productName: 'Yogurt organico', quantity: 24 }, { productName: 'Leche organica', quantity: 30 }, { productName: 'Queso organico', quantity: 12 }] }),
  new Requisition({ id: 'req-2', minimarketId: 'min-1', supplierId: 'sup-2', requester: 'Albino Caceres', supplier: 'Anita Gamboa', productName: 'Leche organica', quantity: 30, reason: 'Demanda semanal de lacteos', status: 'accepted', createdAt: '2026-09-18', reviewedAt: '2026-09-18 11:00', shippingOrderId: 'ship-1001', items: [{ productName: 'Leche organica', quantity: 30 }, { productName: 'Queso organico', quantity: 12 }, { productName: 'Yogurt organico', quantity: 24 }] }),
  new Requisition({ id: 'req-3', minimarketId: 'min-1', supplierId: 'sup-1', requester: 'Albino Caceres', supplier: 'BioAndes Organic', productName: 'Tomate organico', quantity: 45, reason: 'Reposicion para anaquel principal', status: 'pending', createdAt: '2026-09-17', items: [{ productName: 'Tomate organico', quantity: 45 }, { productName: 'Pepino organico', quantity: 20 }, { productName: 'Lechugas organicas', quantity: 15 }] }),
  new Requisition({ id: 'req-4', minimarketId: 'min-1', supplierId: 'sup-2', requester: 'Albino Caceres', supplier: 'Anita Gamboa', productName: 'Queso organico', quantity: 15, reason: 'Stock minimo alcanzado', status: 'rejected', createdAt: '2026-09-16', reviewedAt: '2026-09-16 16:20', rejectionReason: 'Produccion diaria agotada', items: [{ productName: 'Queso organico', quantity: 15 }, { productName: 'Leche organica', quantity: 10 }, { productName: 'Yogurt organico', quantity: 8 }] }),
  new Requisition({ id: 'req-5', minimarketId: 'min-1', supplierId: 'sup-2', requester: 'Albino Caceres', supplier: 'Anita Gamboa', productName: 'Brocoli organico', quantity: 18, reason: 'Campana de productos frescos', status: 'accepted', createdAt: '2026-09-15', reviewedAt: '2026-09-15 12:15', shippingOrderId: 'ship-1003', items: [{ productName: 'Brocoli organico', quantity: 18 }, { productName: 'Pimientos organicos', quantity: 24 }, { productName: 'Yogurt organico', quantity: 12 }] }),
];

export const useRequisitionStore = defineStore('requisition', {
  state: () => ({
    requisitions: demoRequisitions,
    loading: false,
    error: null,
  }),
  actions: {
    async createRequest(data) {
      const request = await requisitionApi.createRequisition({ ...data, id: `req-${crypto.randomUUID()}`, status: 'pending', createdAt: new Date().toISOString().slice(0, 10) });
      this.requisitions.unshift(request);
      return request;
    },
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
    visibleForUser(user) {
      if (!user) return [];
      if (user.roles?.includes('Proveedor Organico')) {
        return this.requisitions.filter((request) => request.supplierId === 'sup-2');
      }
      return this.requisitions.filter((request) => request.minimarketId === 'min-1');
    },
    async acceptRequest(requestId, supplierId = 'sup-2') {
      const request = this.requisitions.find((entry) => entry.id === requestId);
      if (!request || request.status !== 'pending' || request.supplierId !== supplierId) throw new Error('invalid-request-status');
      const reviewedAt = new Date().toISOString();
      const updated = await requisitionApi.updateRequisition(requestId, {
        status: 'accepted', reviewedAt,
        response: { id: `res-${requestId}`, supplierId, accepted: true, comment: 'Solicitud aceptada por el proveedor.', respondedAt: reviewedAt },
      });
      this.requisitions = this.requisitions.map((entry) => entry.id === requestId ? updated : entry);
      return updated;
    },
    async rejectRequest(requestId, reason = 'Solicitud rechazada por disponibilidad.') {
      const request = this.requisitions.find((entry) => entry.id === requestId);
      if (!request || request.status !== 'pending') throw new Error('invalid-request-status');
      const reviewedAt = new Date().toISOString();
      const updated = await requisitionApi.updateRequisition(requestId, {
        status: 'rejected', reviewedAt, rejectionReason: reason,
        response: { id: `res-${requestId}`, supplierId: request.supplierId, accepted: false, comment: reason, respondedAt: reviewedAt },
      });
      this.requisitions = this.requisitions.map((entry) => entry.id === requestId ? updated : entry);
      return updated;
    },
    async linkShippingOrder(requestId, orderId) {
      const updated = await requisitionApi.updateRequisition(requestId, { shippingOrderId: orderId });
      this.requisitions = this.requisitions.map((entry) => entry.id === requestId ? updated : entry);
      return updated;
    },
  },
});
