import { defineStore } from 'pinia';
import { InventoryApi } from '../infrastructure/inventory-api.js';
import { InventoryItem } from '../domain/model/inventory-item.entity.js';

const inventoryApi = new InventoryApi();

const demoItems = [
  new InventoryItem({ id: 'inv-1', productName: 'Lechuga hidroponica', stock: 42, minimumStock: 20, lotCode: 'LOT-001', expirationDate: '2026-09-25', status: 'healthy' }),
  new InventoryItem({ id: 'inv-2', productName: 'Yogurt organico', stock: 12, minimumStock: 18, lotCode: 'LOT-014', expirationDate: '2026-09-22', status: 'risk' }),
  new InventoryItem({ id: 'inv-3', productName: 'Quinua real', stock: 86, minimumStock: 25, lotCode: 'LOT-021', expirationDate: '2027-01-15', status: 'healthy' }),
];

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    items: demoItems,
    loading: false,
    error: null,
  }),
  getters: {
    lowStockCount: (state) => state.items.filter((item) => item.isLowStock).length,
  },
  actions: {
    async fetchInventory() {
      this.loading = true;
      try {
        this.items = await inventoryApi.getInventory();
      } catch (error) {
        this.error = 'No se pudo cargar inventario. Se muestran datos demo.';
        this.items = demoItems;
      } finally {
        this.loading = false;
      }
    },
  },
});
