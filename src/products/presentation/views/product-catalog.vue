<template>
  <section class="products-view">
    <div class="view-header">
      <div>
        <span>Products</span>
        <h2>Catalogo de productos organicos</h2>
        <p>Datos de producto, vencimiento, cantidad, precio y disponibilidad.</p>
      </div>
      <pv-button label="Nuevo producto" icon="pi pi-plus" />
    </div>

    <div class="products-grid">
      <article v-for="product in productsStore.products" :key="product.id">
        <div class="card-top">
          <span>{{ product.category }}</span>
          <strong>{{ product.formattedPrice }}</strong>
        </div>
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <footer>
          <small>{{ product.quantity }} unidades</small>
          <span :class="['status-badge', product.available ? 'status-approved' : 'status-rejected']">
            {{ product.available ? 'Disponible' : 'No disponible' }}
          </span>
        </footer>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProductsStore } from '../../application/products.store.js';

const productsStore = useProductsStore();

onMounted(() => {
  productsStore.fetchProducts();
});
</script>

<style scoped>
.products-view {
  display: grid;
  gap: 18px;
}

.view-header,
.products-grid article {
  background: #ffffff;
  border: 1px solid #e8ede9;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.view-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px;
}

.view-header span,
.card-top span {
  color: #3d9f7d;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2,
.products-grid h3 {
  color: #16251d;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.products-grid p,
footer small {
  color: #66756b;
  font-weight: 700;
}

.products-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.products-grid article {
  display: grid;
  gap: 12px;
  padding: 22px;
}

.card-top,
footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.card-top strong {
  color: #f08a24;
  font-size: 18px;
  font-weight: 950;
}
</style>
