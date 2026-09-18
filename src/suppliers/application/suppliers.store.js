import { defineStore } from 'pinia';
import { SuppliersApi } from '../infrastructure/suppliers-api.js';
import { Supplier } from '../domain/model/supplier.entity.js';

const suppliersApi = new SuppliersApi();

const demoSuppliers = [
  new Supplier({ id: 'sup-1', businessName: 'BioAndes Organic', ruc: '20600011122', email: 'ventas@bioandes.pe', phone: '+51 955 222 110', address: 'Ruta Agricola 45', specialty: 'Lacteos y vegetales', coverageArea: 'Lima' }),
  new Supplier({ id: 'sup-2', businessName: 'Valle Vivo', ruc: '20600033344', email: 'contacto@vallevivo.pe', phone: '+51 944 555 100', address: 'Valle Sagrado 330', specialty: 'Granos organicos', coverageArea: 'Lima y Callao' }),
];

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    suppliers: demoSuppliers,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchSuppliers() {
      this.loading = true;
      try {
        this.suppliers = await suppliersApi.getSuppliers();
      } catch (error) {
        this.error = 'No se pudo cargar proveedores. Se muestran datos demo.';
        this.suppliers = demoSuppliers;
      } finally {
        this.loading = false;
      }
    },
  },
});
