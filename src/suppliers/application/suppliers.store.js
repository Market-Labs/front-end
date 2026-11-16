import { defineStore } from 'pinia';
import { SuppliersApi } from '../infrastructure/suppliers-api.js';

const suppliersApi = new SuppliersApi();

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    suppliers: [],
    loading: false,
    error: null,
  }),
  getters: {
    activeSuppliers: (state) => state.suppliers.filter((supplier) => supplier.status !== 'inactive'),
  },
  actions: {
    async createSupplier(data) {
      const supplier = await suppliersApi.createSupplier(data);
      this.suppliers.push(supplier);
      return supplier;
    },
    async updateSupplier(id, changes) {
      const supplier = await suppliersApi.updateSupplier(id, changes);
      this.suppliers = this.suppliers.map((entry) => entry.id === id ? supplier : entry);
      return supplier;
    },
    async deactivateSupplier(id) {
      return this.updateSupplier(id, { status: 'inactive' });
    },
    async fetchSuppliers() {
      this.loading = true;
      try {
        this.suppliers = await suppliersApi.getSuppliers();
      } catch (error) {
        this.error = 'No se pudo cargar proveedores desde la API.';
        this.suppliers = [];
      } finally {
        this.loading = false;
      }
    },
  },
});
