import { defineStore } from 'pinia';
import { ProductsApi } from '../infrastructure/products-api.js';
import { Product } from '../domain/model/product.entity.js';

const productsApi = new ProductsApi();

const demoProducts = [
  new Product({ id: 'prod-1', name: 'Tomate organico', description: 'Tomates frescos de cultivo organico.', category: 'Vegetales', expirationDate: '2026-09-28', quantity: 60, price: 3.8, available: true }),
  new Product({ id: 'prod-2', name: 'Lechugas organicas', description: 'Lechugas frescas seleccionadas.', category: 'Vegetales', expirationDate: '2026-09-25', quantity: 42, price: 4.5, available: true }),
  new Product({ id: 'prod-3', name: 'Yogurt organico', description: 'Yogurt artesanal sin preservantes.', category: 'Lacteos', expirationDate: '2026-09-22', quantity: 12, price: 8.9, available: true }),
  new Product({ id: 'prod-4', name: 'Manzanas organicas', description: 'Manzanas dulces de cosecha natural.', category: 'Frutas', expirationDate: '2026-10-05', quantity: 75, price: 5.2, available: true }),
  new Product({ id: 'prod-5', name: 'Pepino organico', description: 'Pepinos frescos para consumo saludable.', category: 'Vegetales', expirationDate: '2026-09-27', quantity: 38, price: 2.9, available: true }),
  new Product({ id: 'prod-6', name: 'Zanahoria organica', description: 'Zanahorias seleccionadas de cultivo natural.', category: 'Vegetales', expirationDate: '2026-10-02', quantity: 54, price: 3.4, available: true }),
  new Product({ id: 'prod-7', name: 'Brocoli organico', description: 'Brocoli fresco rico en nutrientes.', category: 'Vegetales', expirationDate: '2026-09-29', quantity: 31, price: 6.3, available: true }),
  new Product({ id: 'prod-8', name: 'Pimientos organicos', description: 'Pimientos organicos variados.', category: 'Vegetales', expirationDate: '2026-10-01', quantity: 44, price: 5.8, available: true }),
  new Product({ id: 'prod-9', name: 'Queso organico', description: 'Queso fresco de produccion artesanal.', category: 'Lacteos', expirationDate: '2026-09-30', quantity: 20, price: 14.5, available: true }),
  new Product({ id: 'prod-10', name: 'Leche organica', description: 'Leche fresca de proveedor local.', category: 'Lacteos', expirationDate: '2026-09-24', quantity: 36, price: 7.2, available: true }),
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
    addDemoProduct() {
      const next = this.products.length + 1;
      this.products = [
        new Product({
          id: `prod-demo-${next}`,
          name: `Producto organico ${next}`,
          description: 'Nuevo producto registrado desde la interfaz.',
          category: 'Organicos',
          expirationDate: '2026-10-10',
          quantity: 25,
          price: 6.5,
          available: true,
        }),
        ...this.products,
      ];
    },
  },
});
