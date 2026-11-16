import { defineStore } from 'pinia';
import { RequisitionApi } from '../infrastructure/requisition-api.js';

const requisitionApi = new RequisitionApi();

export const useRequisitionStore = defineStore('requisition', {
  state: () => ({
    requisitions: [],
    loading: false,
    error: null,
  }),
  actions: {
    async createRequest(data) {
      const request = await requisitionApi.createRequisition(data);
      this.requisitions.unshift(request);
      return request;
    },
    async fetchRequisitions() {
      this.loading = true;
      try {
        this.requisitions = await requisitionApi.getRequisitions();
      } catch (error) {
        this.error = 'No se pudo cargar solicitudes desde la API.';
        this.requisitions = [];
      } finally {
        this.loading = false;
      }
    },
    visibleForUser(user) {
      if (!user) return [];
      if (user.roles?.includes('Proveedor Organico')) {
        return this.requisitions.filter((request) => request.supplierId === user.organizationId);
      }
      return this.requisitions.filter((request) => request.minimarketId === user.organizationId);
    },
    async acceptRequest(requestId, supplierId) {
      const request = this.requisitions.find((entry) => entry.id === requestId);
      if (!request || request.status !== 'pending' || request.supplierId !== supplierId) throw new Error('invalid-request-status');
      const updated = await requisitionApi.updateRequisition(requestId, { status: 'accepted' });
      this.requisitions = this.requisitions.map((entry) => entry.id === requestId ? updated : entry);
      return updated;
    },
    async rejectRequest(requestId, reason = 'Solicitud rechazada por disponibilidad.') {
      const request = this.requisitions.find((entry) => entry.id === requestId);
      if (!request || request.status !== 'pending') throw new Error('invalid-request-status');
      const updated = await requisitionApi.updateRequisition(requestId, { status: 'rejected', rejectionReason: reason });
      this.requisitions = this.requisitions.map((entry) => entry.id === requestId ? updated : entry);
      return updated;
    },
  },
});
