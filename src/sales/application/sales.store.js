import { defineStore } from 'pinia';
import { SalesApi } from '../infrastructure/sales-api.js';
import { Sale, saleFromReceivedOrder } from '../domain/model/sale.entity.js';
import { useProcurementsStore } from '../../procurements/application/procurements.store.js';
import { useInventoryStore } from '../../inventory/application/inventory.store.js';

const salesApi = new SalesApi();

export const useSalesStore = defineStore('sales', {
  state: () => ({ retailSales: [], loading: false, saving: false, error: null }),
  getters: {
    supplierSales: () => {
      const procurementsStore = useProcurementsStore();
      return procurementsStore.orders.filter((order) => order.status === 'received').map(saleFromReceivedOrder);
    },
  },
  actions: {
    async fetchSales() {
      this.loading = true;
      this.error = null;
      try {
        this.retailSales = await salesApi.getRetailSales();
      } catch {
        this.error = 'No se pudieron cargar las ventas.';
        this.retailSales = [];
      } finally {
        this.loading = false;
      }
    },
    async createRetailSale(data) {
      const inventoryStore = useInventoryStore();
      const draft = new Sale(data);
      if (!draft.items.length || draft.items.some((item) => !Number.isInteger(item.quantity) || item.quantity <= 0 || item.unitPrice <= 0) || draft.discount < 0 || draft.discount > draft.subtotal) {
        throw new Error('invalid-sale');
      }
      this.saving = true;
      this.error = null;
      let allocations = [];
      try {
        allocations = await inventoryStore.allocateSale(draft.items);
        const sale = await salesApi.createRetailSale({ ...data, id: `sale-${crypto.randomUUID()}` });
        this.retailSales.unshift(sale);
        return sale;
      } catch (error) {
        if (allocations.length) await inventoryStore.restoreAllocations(allocations);
        this.error = error.message === 'insufficient-stock' ? 'Stock insuficiente.' : 'No se pudo registrar la venta.';
        throw error;
      } finally {
        this.saving = false;
      }
    },
  },
});
