import { defineStore } from 'pinia';
import { InventoryApi } from '../infrastructure/inventory-api.js';
import { useIamStore } from '../../iam/application/iam.store.js';

const inventoryApi = new InventoryApi();

export const useInventoryStore = defineStore('inventory', {
  state: () => ({ items: [], waste: [], loading: false, error: null }),
  getters: {
    lowStockCount: (state) => state.items.filter((item) => item.isLowStock).length,
  },
  actions: {
    async fetchInventory(isSupplier = useIamStore().isSupplier) {
      this.loading = true;
      this.error = null;
      try { this.items = await inventoryApi.getInventory(isSupplier); }
      catch { this.items = []; this.error = 'No se pudo cargar inventario desde la API.'; }
      finally { this.loading = false; }
    },
    async fetchWaste(isSupplier = useIamStore().isSupplier) {
      try { this.waste = await inventoryApi.getWaste(isSupplier); }
      catch { this.waste = []; }
    },
    async registerStock(data, isSupplier = useIamStore().isSupplier) {
      const item = await inventoryApi.createItem(data, isSupplier);
      this.items.push(item);
      return item;
    },
    async registerWaste({ itemId, quantity, reason, isSupplier = useIamStore().isSupplier }) {
      const record = await inventoryApi.createWaste({ inventoryItemId: itemId, quantity, reason }, isSupplier);
      await this.fetchInventory(isSupplier);
      await this.fetchWaste(isSupplier);
      return record;
    },
    async registerStockOutput({ itemId, quantity }) {
      const item = this.items.find((entry) => entry.id === itemId);
      if (!item || !Number.isInteger(quantity) || quantity <= 0 || quantity > item.stock) throw new Error('invalid-output');
      const updated = await inventoryApi.updateItem(itemId, { stock: item.stock - quantity }, useIamStore().isSupplier);
      this.items = this.items.map((entry) => entry.id === itemId ? updated : entry);
      return updated;
    },
    async registerOffer() { throw new Error('backend-feature-unavailable:offers'); },
  },
});
