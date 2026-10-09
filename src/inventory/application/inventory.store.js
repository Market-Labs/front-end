import { defineStore } from 'pinia';
import { InventoryApi } from '../infrastructure/inventory-api.js';
import { InventoryItem } from '../domain/model/inventory-item.entity.js';
import { isFirebaseMode } from '../../shared/infrastructure/firebase-client.js';
import { registerWasteInFirestore } from '../infrastructure/firestore-waste.js';
import { registerStockOutputInFirestore } from '../infrastructure/firestore-stock-output.js';

const inventoryApi = new InventoryApi();

const demoItems = [
  new InventoryItem({ id: 'inv-1', productName: 'Lechugas organicas', stock: 42, minimumStock: 20, lotCode: 'LOT-001', expirationDate: '2026-09-25', status: 'healthy' }),
  new InventoryItem({ id: 'inv-2', productName: 'Yogurt organico', stock: 12, minimumStock: 18, lotCode: 'LOT-014', expirationDate: '2026-09-22', status: 'risk' }),
  new InventoryItem({ id: 'inv-3', productName: 'Tomate organico', stock: 60, minimumStock: 25, lotCode: 'LOT-021', expirationDate: '2026-09-28', status: 'healthy' }),
  new InventoryItem({ id: 'inv-4', productName: 'Manzanas organicas', stock: 75, minimumStock: 30, lotCode: 'LOT-022', expirationDate: '2026-10-05', status: 'healthy' }),
  new InventoryItem({ id: 'inv-5', productName: 'Pepino organico', stock: 38, minimumStock: 18, lotCode: 'LOT-023', expirationDate: '2026-09-27', status: 'healthy' }),
  new InventoryItem({ id: 'inv-6', productName: 'Zanahoria organica', stock: 54, minimumStock: 22, lotCode: 'LOT-024', expirationDate: '2026-10-02', status: 'healthy' }),
  new InventoryItem({ id: 'inv-7', productName: 'Brocoli organico', stock: 31, minimumStock: 16, lotCode: 'LOT-025', expirationDate: '2026-09-29', status: 'healthy' }),
  new InventoryItem({ id: 'inv-8', productName: 'Pimientos organicos', stock: 44, minimumStock: 20, lotCode: 'LOT-026', expirationDate: '2026-10-01', status: 'healthy' }),
  new InventoryItem({ id: 'inv-9', productName: 'Queso organico', stock: 20, minimumStock: 14, lotCode: 'LOT-027', expirationDate: '2026-09-30', status: 'healthy' }),
  new InventoryItem({ id: 'inv-10', productName: 'Leche organica', stock: 36, minimumStock: 24, lotCode: 'LOT-028', expirationDate: '2026-09-24', status: 'healthy' }),
];

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: isFirebaseMode ? [] : demoItems,
    waste: [],
    loading: false,
    error: null,
  }),
  getters: {
    lowStockCount: (state) => state.items.filter((item) => item.isLowStock).length,
  },
  actions: {
    async fetchWaste(isSupplier = false) {
      try {
        this.waste = await inventoryApi.getWaste(isSupplier);
      } catch {
        this.waste = [];
      }
    },
    async registerWaste({ itemId, quantity, reason, ownerId, isSupplier }) {
      const item = this.items.find((entry) => entry.id === itemId);
      if (!item || !Number.isInteger(quantity) || quantity <= 0 || quantity > item.stock) throw new Error('invalid-waste');
      if (isFirebaseMode) {
        const { record, updated } = await registerWasteInFirestore({ item, quantity, reason, ownerId, isSupplier });
        Object.assign(item, updated);
        this.waste.unshift(record);
        return record;
      }
      const before = item.stock;
      const stock = before - quantity;
      const updated = await inventoryApi.updateItem(item.id, { stock, status: stock <= item.minimumStock ? 'risk' : 'healthy' }, isSupplier);
      Object.assign(item, updated);
      try {
        const record = await inventoryApi.createWaste({ id: `waste-${crypto.randomUUID()}`, ownerId, productName: item.productName, lotCode: item.lotCode, quantity, unit: 'units', reason, recordedAt: new Date().toISOString() });
        this.waste.unshift(record);
        return record;
      } catch (error) {
        const restored = await inventoryApi.updateItem(item.id, { stock: before, status: before <= item.minimumStock ? 'risk' : 'healthy' }, isSupplier);
        Object.assign(item, restored);
        throw error;
      }
    },
    async registerStockOutput({ itemId, quantity, ownerId }) {
      const item = this.items.find((entry) => entry.id === itemId);
      if (!item || !Number.isInteger(quantity) || quantity <= 0 || quantity > item.stock) {
        throw new Error('invalid-output');
      }
      const movement = {
        id: `stock-update-${crypto.randomUUID()}`,
        reason: 'dispatch',
        quantity,
        before: item.stock,
        after: item.stock - quantity,
        recordedAt: new Date().toISOString(),
      };
      const updated = isFirebaseMode
        ? await registerStockOutputInFirestore({ item, quantity, ownerId, movement })
        : await inventoryApi.updateItem(item.id, {
          stock: item.stock - quantity,
          status: item.stock - quantity <= item.minimumStock ? 'risk' : 'healthy',
          stockUpdates: [...item.stockUpdates, movement],
        });
      Object.assign(item, updated);
      return updated;
    },
    async registerStock(data, isSupplier = false) {
      const item = await inventoryApi.createItem({ ...data, id: `inv-${crypto.randomUUID()}`, status: data.stock <= data.minimumStock ? 'risk' : 'healthy' }, isSupplier);
      this.items.push(item);
      return item;
    },
    async fetchInventory(isSupplier = false) {
      this.loading = true;
      try {
        this.items = await inventoryApi.getInventory(isSupplier);
      } catch (error) {
        this.error = isFirebaseMode ? 'No se pudo cargar inventario desde Firestore.' : 'No se pudo cargar inventario. Se muestran datos demo.';
        this.items = isSupplier || isFirebaseMode ? [] : demoItems;
      } finally {
        this.loading = false;
      }
    },
    async receiveShipmentItems(shipmentItems = [], products = [], orderId = '') {
      const changes = [];
      try {
        for (const shipmentItem of shipmentItems) {
          const inventoryItem = this.items.find((item) => item.productName === shipmentItem.productName);
          if (inventoryItem) {
            const before = inventoryItem.stock;
            const stock = before + Number(shipmentItem.quantity);
            const saved = await inventoryApi.updateItem(inventoryItem.id, { stock, status: stock <= inventoryItem.minimumStock ? 'risk' : 'healthy' });
            Object.assign(inventoryItem, saved);
            changes.push({ item: inventoryItem, before });
          } else {
            const product = products.find((entry) => entry.name === shipmentItem.productName);
            if (!product) throw new Error(`missing-product:${shipmentItem.productName}`);
            const saved = await inventoryApi.createItem({
              id: `inv-${crypto.randomUUID()}`, productName: product.name,
              stock: Number(shipmentItem.quantity), minimumStock: 0,
              lotCode: `SHIP-${orderId}`, expirationDate: product.expirationDate, status: 'healthy',
            });
            this.items.push(saved);
            changes.push({ item: saved, created: true });
          }
        }
        return changes;
      } catch (error) {
        await this.restoreShipment(changes);
        throw error;
      }
    },
    async restoreShipment(changes) {
      for (const change of [...changes].reverse()) {
        if (change.created) {
          await inventoryApi.deleteItem(change.item.id);
          this.items = this.items.filter((entry) => entry.id !== change.item.id);
        } else {
          const stock = change.before;
          const saved = await inventoryApi.updateItem(change.item.id, { stock, status: stock <= change.item.minimumStock ? 'risk' : 'healthy' });
          Object.assign(change.item, saved);
        }
      }
    },
  },
});
