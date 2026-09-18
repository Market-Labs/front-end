import { defineStore } from 'pinia';
import { ProductsApi } from '../infrastructure/products-api.js';
import { Product } from '../domain/model/product.entity.js';

const productsApi = new ProductsApi();

const demoProducts = [
  new Product({ id: 'prod-1', name: 'Lechuga hidroponica', description: 'Hojas frescas certificadas.', category: 'Vegetales', expirationDate: '2026-09-25', quantity: 42, price: 4.5, available: true }),
  new Product({ id: 'prod-2', name: 'Yogurt organico', description: 'Lacteo artesanal sin preservantes.', category: 'Lacteos', expirationDate: '2026-09-22', quantity: 12, price: 8.9, available: true }),
  new Product({ id: 'prod-3', name: 'Miel de abeja', description: 'Produccion natural de valle alto.', category: 'Abarrotes', expirationDate: '2027-03-10', quantity: 0, price: 18.5, available: false }),
];

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: demoProducts,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        this.products = await productsApi.getProducts();
      } catch (error) {
        this.error = 'No se pudo cargar catalogo. Se muestran datos demo.';
        this.products = demoProducts;
      } finally {
        this.loading = false;
      }
    },
  },
});
