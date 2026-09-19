import { defineStore } from 'pinia';
import { InventoryApi } from '../infrastructure/inventory-api.js';
import { InventoryItem } from '../domain/model/inventory-item.entity.js';

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
    receiveShipmentItems(shipmentItems = []) {
      shipmentItems.forEach((shipmentItem) => {
        const inventoryItem = this.items.find((item) => item.productName === shipmentItem.productName);
        if (inventoryItem) {
          inventoryItem.stock += Number(shipmentItem.quantity || 0);
          inventoryItem.status = inventoryItem.stock <= inventoryItem.minimumStock ? 'risk' : 'healthy';
        }
      });
    },
  },
});
