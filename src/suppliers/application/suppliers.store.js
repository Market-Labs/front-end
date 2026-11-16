import { defineStore } from 'pinia';
import { SuppliersApi } from '../infrastructure/suppliers-api.js';
import { Supplier } from '../domain/model/supplier.entity.js';
import { nextSupplierId } from '../domain/model/supplier-id.js';

const suppliersApi = new SuppliersApi();

const demoSuppliers = [
  new Supplier({ id: 'sup-1', businessName: 'BioAndes Organic', ruc: '20600011122', email: 'ventas@bioandes.pe', phone: '+51 955 222 110', address: 'Ruta Agricola 45', specialty: 'Lacteos y vegetales', coverageArea: 'Lima' }),
  new Supplier({ id: 'sup-2', businessName: 'Anita Gamboa', ruc: '10456789012', email: 'anita.gamboa@marketgo.pe', phone: '+51 959 404 210', address: 'Cerro Colorado, Arequipa', specialty: 'Lacteos y derivados', coverageArea: 'Cerro Colorado - Arequipa' }),
];

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
