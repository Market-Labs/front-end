import { defineStore } from 'pinia';
import { ProductsApi } from '../infrastructure/products-api.js';
import { useIamStore } from '../../iam/application/iam.store.js';

const productsApi = new ProductsApi();

const categoryPrefixes = Object.freeze({ Vegetales: 'VGT', Frutas: 'FRT', Lacteos: 'LCT', Organicos: 'ORG' });

const nextProductId = (products, category) => {
  const prefix = categoryPrefixes[category];
  if (!prefix) throw new Error('invalid-category');
  const max = products.reduce((highest, product) => {
    const match = new RegExp(`^${prefix}-(\\d+)$`).exec(product.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(5, '0')}`;
};

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    saving: false,
    error: null,
  }),
  getters: {
    nextIdForCategory: (state) => (category) => category ? nextProductId(state.products, category) : '',
  },
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        this.products = await productsApi.getProducts(useIamStore().isSupplier);
      } catch (error) {
        this.error = 'No se pudo cargar el catálogo desde la API.';
        this.products = [];
      } finally {
        this.loading = false;
      }
    },
    async createProduct(data) {
      this.saving = true;
      this.error = null;
      try {
        const product = await productsApi.createProduct(data);
        this.products.push(product);
        return product;
      } catch (error) {
        this.error = 'No se pudo guardar el producto en la API.';
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async updateProduct(id, changes) {
      this.saving = true;
      this.error = null;
      try {
        const product = await productsApi.updateProduct(id, changes);
        this.products = this.products.map((entry) => entry.id === id ? product : entry);
        return product;
      } catch (error) {
        this.error = 'No se pudo actualizar el producto en la API.';
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async deleteProduct(id) {
      this.saving = true;
      this.error = null;
      try {
        await productsApi.deleteProduct(id);
        this.products = this.products.filter((entry) => entry.id !== id);
      } catch (error) {
        this.error = 'No se pudo eliminar el producto de la API.';
        throw error;
      } finally {
        this.saving = false;
      }
    },
  },
});
