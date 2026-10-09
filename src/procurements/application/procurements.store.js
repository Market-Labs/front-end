import { defineStore } from 'pinia';
import { ProcurementsApi } from '../infrastructure/procurements-api.js';
import { ProcurementOrder } from '../domain/model/procurement-order.entity.js';
import { useIamStore } from '../../iam/application/iam.store.js';
import { isFirebaseMode } from '../../shared/infrastructure/firebase-client.js';
import { receiveOrderInFirestore } from '../infrastructure/firestore-reception.js';
import { useInventoryStore } from '../../inventory/application/inventory.store.js';
import { createShippingOrderInFirestore } from '../infrastructure/firestore-shipping.js';

const procurementsApi = new ProcurementsApi();

const demoOrders = [
  new ProcurementOrder({ id: 'ship-1001', supplyRequestId: 'req-2', supplierId: 'sup-2', minimarketId: 'min-1', supplier: 'Anita Gamboa', minimarket: 'Minimarket Verde Sur', status: 'pending-reception', total: 603.6, createdAt: '2026-09-18', shippingDate: '2026-09-19', observations: 'Despacho refrigerado para lacteos.', items: [{ productName: 'Leche organica', quantity: 30, unitPrice: 7.2 }, { productName: 'Queso organico', quantity: 12, unitPrice: 14.5 }, { productName: 'Yogurt organico', quantity: 24, unitPrice: 8.9 }] }),
  new ProcurementOrder({ id: 'ship-1002', supplyRequestId: 'req-3', supplierId: 'sup-1', minimarketId: 'min-1', supplier: 'BioAndes Organic', minimarket: 'Minimarket Verde Sur', status: 'pending-reception', total: 296.5, createdAt: '2026-09-17', shippingDate: '2026-09-19', observations: 'Entrega parcial de vegetales frescos.', items: [{ productName: 'Tomate organico', quantity: 45, unitPrice: 3.8 }, { productName: 'Pepino organico', quantity: 20, unitPrice: 2.9 }, { productName: 'Lechugas organicas', quantity: 15, unitPrice: 4.5 }] }),
  new ProcurementOrder({ id: 'ship-1003', supplyRequestId: 'req-5', supplierId: 'sup-2', minimarketId: 'min-1', supplier: 'Anita Gamboa', minimarket: 'Minimarket Verde Sur', status: 'received', total: 359.4, createdAt: '2026-09-15', shippingDate: '2026-09-16', receivedAt: '2026-09-16 15:40', observations: 'Recepcion aceptada sin observaciones.', items: [{ productName: 'Brocoli organico', quantity: 18, unitPrice: 6.3 }, { productName: 'Pimientos organicos', quantity: 24, unitPrice: 5.8 }, { productName: 'Yogurt organico', quantity: 12, unitPrice: 8.9 }] }),
  new ProcurementOrder({ id: 'ship-1004', supplyRequestId: 'req-4', supplierId: 'sup-2', minimarketId: 'min-1', supplier: 'Anita Gamboa', minimarket: 'Minimarket Verde Sur', status: 'rejected', total: 360.7, createdAt: '2026-09-16', shippingDate: '2026-09-17', rejectionReason: 'Solicitud rechazada por disponibilidad.', items: [{ productName: 'Queso organico', quantity: 15, unitPrice: 14.5 }, { productName: 'Leche organica', quantity: 10, unitPrice: 7.2 }, { productName: 'Yogurt organico', quantity: 8, unitPrice: 8.9 }] }),
];

export const useProcurementsStore = defineStore('procurements', {
  state: () => ({
    orders: isFirebaseMode ? [] : demoOrders,
    loading: false,
    error: null,
  }),
  actions: {
    async createOrder(data) {
      const order = await procurementsApi.createOrder({ ...data, id: `ship-${crypto.randomUUID()}`, status: 'pending-reception', createdAt: new Date().toISOString().slice(0, 10) });
      this.orders.unshift(order);
      return order;
    },
    async fetchOrders() {
      this.loading = true;
      try {
        this.orders = await procurementsApi.getOrders();
      } catch (error) {
        this.error = isFirebaseMode ? 'No se pudo cargar pedidos desde Firestore.' : 'No se pudo cargar abastecimientos. Se muestran datos demo.';
        this.orders = isFirebaseMode ? [] : demoOrders;
      } finally {
        this.loading = false;
      }
    },
    visibleForUser(user) {
      if (!user) return [];
      if (user.roles?.includes('Proveedor Organico')) {
        return this.orders.filter((order) => order.supplierId === (user.supplierId || 'sup-2'));
      }
      return this.orders.filter((order) => order.minimarketId === (user.minimarketId || 'min-1'));
    },
    async createFromSupplyRequest(request, products = [], shippingDate = new Date().toISOString().slice(0, 10)) {
      if (request.status !== 'accepted' || request.shippingOrderId) throw new Error('invalid-request-status');
      if (isFirebaseMode) {
        const resource = await createShippingOrderInFirestore(request, products, useIamStore().currentSupplierId, shippingDate);
        this.orders.unshift(new ProcurementOrder(resource));
        return resource.id;
      }
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
          minimarket: 'Minimarket Verde Sur',
          total: Number(total.toFixed(2)),
          shippingDate,
          observations: 'Orden de envio generada desde una solicitud aceptada.',
          items,
      });
      return order.id;
    },
    async acceptReception(orderId, products = []) {
      const order = this.orders.find((entry) => entry.id === orderId);
      if (!order?.canBeReviewed) throw new Error('invalid-order-status');
      if (isFirebaseMode) {
        const resource = await receiveOrderInFirestore(order, products, useIamStore().currentUser.id);
        const updated = new ProcurementOrder(resource);
        this.orders = this.orders.map((entry) => entry.id === orderId ? updated : entry);
        await useInventoryStore().fetchInventory();
        return updated;
      }
      const receivedAt = new Date().toISOString();
      const updated = await procurementsApi.updateOrder(orderId, {
        status: 'received', receivedAt,
        reception: { administratorId: useIamStore().currentUser?.id || 'usr-admin', accepted: true, reviewedAt: receivedAt },
      });
      this.orders = this.orders.map((entry) => entry.id === orderId ? updated : entry);
      return updated;
    },
    async rejectReception(orderId, reason = 'Recepcion rechazada por diferencias en la entrega.') {
      const order = this.orders.find((entry) => entry.id === orderId);
      if (!order?.canBeReviewed) throw new Error('invalid-order-status');
      const updated = await procurementsApi.updateOrder(orderId, {
        status: 'rejected', rejectionReason: reason,
        reception: { administratorId: useIamStore().currentUser?.id || 'usr-admin', accepted: false, comment: reason, reviewedAt: new Date().toISOString() },
      });
      this.orders = this.orders.map((entry) => entry.id === orderId ? updated : entry);
      return updated;
    },
  },
});
