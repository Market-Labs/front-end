import { defineStore } from 'pinia';
import { ProductsApi } from '../infrastructure/products-api.js';
import { Product } from '../domain/model/product.entity.js';
import { isFirebaseMode } from '../../shared/infrastructure/firebase-client.js';

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

const demoProducts = [
  new Product({ id: 'VGT-00001', name: 'Tomate organico', description: 'Tomates frescos de cultivo organico.', category: 'Vegetales', expirationDate: '2026-09-28', quantity: 60, price: 3.8, available: true, supplierId: 'sup-1' }),
  new Product({ id: 'VGT-00002', name: 'Lechugas organicas', description: 'Lechugas frescas seleccionadas.', category: 'Vegetales', expirationDate: '2026-09-25', quantity: 42, price: 4.5, available: true, supplierId: 'sup-1' }),
  new Product({ id: 'LCT-00001', name: 'Yogurt organico', description: 'Yogurt artesanal sin preservantes.', category: 'Lacteos', expirationDate: '2026-09-22', quantity: 12, price: 8.9, available: true, supplierId: 'sup-2' }),
  new Product({ id: 'FRT-00001', name: 'Manzanas organicas', description: 'Manzanas dulces de cosecha natural.', category: 'Frutas', expirationDate: '2026-10-05', quantity: 75, price: 5.2, available: true, supplierId: 'sup-1' }),
  new Product({ id: 'VGT-00003', name: 'Pepino organico', description: 'Pepinos frescos para consumo saludable.', category: 'Vegetales', expirationDate: '2026-09-27', quantity: 38, price: 2.9, available: true, supplierId: 'sup-1' }),
  new Product({ id: 'VGT-00004', name: 'Zanahoria organica', description: 'Zanahorias seleccionadas de cultivo natural.', category: 'Vegetales', expirationDate: '2026-10-02', quantity: 54, price: 3.4, available: true, supplierId: 'sup-1' }),
  new Product({ id: 'VGT-00005', name: 'Brocoli organico', description: 'Brocoli fresco rico en nutrientes.', category: 'Vegetales', expirationDate: '2026-09-29', quantity: 31, price: 6.3, available: true, supplierId: 'sup-1' }),
  new Product({ id: 'VGT-00006', name: 'Pimientos organicos', description: 'Pimientos organicos variados.', category: 'Vegetales', expirationDate: '2026-10-01', quantity: 44, price: 5.8, available: true, supplierId: 'sup-1' }),
  new Product({ id: 'LCT-00002', name: 'Queso organico', description: 'Queso fresco de produccion artesanal.', category: 'Lacteos', expirationDate: '2026-09-30', quantity: 20, price: 14.5, available: true, supplierId: 'sup-2' }),
  new Product({ id: 'LCT-00003', name: 'Leche organica', description: 'Leche fresca de proveedor local.', category: 'Lacteos', expirationDate: '2026-09-24', quantity: 36, price: 7.2, available: true, supplierId: 'sup-2' }),
];

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: isFirebaseMode ? [] : demoProducts,
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
        this.products = await productsApi.getProducts();
      } catch (error) {
        this.error = isFirebaseMode ? 'No se pudo cargar el catalogo desde Firestore.' : 'No se pudo cargar catalogo. Se muestran datos demo.';
        this.products = isFirebaseMode ? [] : demoProducts;
      } finally {
        this.loading = false;
      }
    },
    async createProduct(data) {
      this.saving = true;
      this.error = null;
      try {
        const product = await productsApi.createProduct({ ...data, id: nextProductId(this.products, data.category) });
        this.products.push(product);
        return product;
      } catch (error) {
        this.error = 'No se pudo guardar el producto en la API de prueba.';
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
        this.error = 'No se pudo actualizar el producto en la API de prueba.';
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
        this.error = 'No se pudo eliminar el producto de la API de prueba.';
        throw error;
      } finally {
        this.saving = false;
      }
    },
  },
});
