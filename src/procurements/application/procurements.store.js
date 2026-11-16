import { defineStore } from 'pinia';
import { ProcurementsApi } from '../infrastructure/procurements-api.js';
import { useIamStore } from '../../iam/application/iam.store.js';
import { useInventoryStore } from '../../inventory/application/inventory.store.js';
import { useProfilesStore } from '../../profiles/application/profiles.store.js';

const procurementsApi = new ProcurementsApi();

export const useProcurementsStore = defineStore('procurements', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
  }),
  actions: {
    async createOrder(data) {
      const order = await procurementsApi.createOrder(data);
      this.orders.unshift(order);
      return order;
    },
    async fetchOrders() {
      this.loading = true;
      try {
        this.orders = await procurementsApi.getOrders();
      } catch (error) {
        this.error = 'No se pudo cargar órdenes desde la API.';
        this.orders = [];
      } finally {
        this.loading = false;
      }
    },
    visibleForUser(user) {
      if (!user) return [];
      if (user.roles?.includes('Proveedor Organico')) {
        return this.orders.filter((order) => order.supplierId === user.organizationId);
      }
      return this.orders.filter((order) => order.minimarketId === user.organizationId);
    },
    async createFromSupplyRequest(request, products = [], shippingDate = new Date().toISOString().slice(0, 10)) {
      if (request.status !== 'accepted' || request.shippingOrderId) throw new Error('invalid-request-status');
      const items = request.items.map((item) => ({
        productName: item.productName,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice ?? products.find((product) => product.name === item.productName)?.price ?? 0),
      }));
      if (items.some((item) => item.unitPrice <= 0)) throw new Error('missing-product-price');
      const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
      const order = await this.createOrder({
          supplyRequestId: request.id,
          supplierId: request.supplierId,
          minimarketId: request.minimarketId,
          supplier: request.supplier,
          minimarket: request.minimarket || useProfilesStore().profiles.find((profile) => profile.organizationId === request.minimarketId)?.businessName || 'Minimarket',
          total: Number(total.toFixed(2)),
          shippingDate,
          observations: 'Orden de envio generada desde una solicitud aceptada.',
          items,
      });
      return order.id;
    },
    async acceptReception(orderId, receivedLines) {
      const order = this.orders.find((entry) => entry.id === orderId);
      if (!order?.canBeReviewed) throw new Error('invalid-order-status');
      if (!receivedLines?.length) throw new Error('missing-received-lines');
      const updated = await procurementsApi.updateOrder(orderId, { status: 'received', receivedLines });
      this.orders = this.orders.map((entry) => entry.id === orderId ? updated : entry);
      await useInventoryStore().fetchInventory();
      return updated;
    },
    async rejectReception(orderId, reason = 'Recepcion rechazada por diferencias en la entrega.') {
      const order = this.orders.find((entry) => entry.id === orderId);
      if (!order?.canBeReviewed) throw new Error('invalid-order-status');
      const updated = await procurementsApi.updateOrder(orderId, { status: 'rejected', rejectionReason: reason });
      this.orders = this.orders.map((entry) => entry.id === orderId ? updated : entry);
      return updated;
    },
  },
});
