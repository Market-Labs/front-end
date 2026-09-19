<template>
  <section class="products-view">
    <div class="view-header">
      <div>
        <span>Products</span>
        <h2>Catalogo de productos organicos</h2>
        <p>Datos de producto, vencimiento, cantidad, precio y disponibilidad.</p>
      </div>
      <pv-button label="Nuevo producto" icon="pi pi-plus" @click="showProductForm = true" />
    </div>

    <pv-dialog v-model:visible="showProductForm" modal header="Nuevo producto" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          Nombre
          <pv-input-text v-model="productForm.name" placeholder="Tomate organico" />
        </label>
        <label>
          Categoria
          <pv-select v-model="productForm.category" :options="categoryOptions" placeholder="Seleccionar categoria" />
        </label>
        <label>
          Fecha de vencimiento
          <pv-input-text v-model="productForm.expirationDate" placeholder="2026-10-01" />
        </label>
        <div class="form-row">
          <label>
            Cantidad
            <pv-input-text v-model="productForm.quantity" placeholder="40" />
          </label>
          <label>
            Precio
            <pv-input-text v-model="productForm.price" placeholder="5.80" />
          </label>
        </div>
        <label>
          Descripcion
          <pv-input-text v-model="productForm.description" placeholder="Producto organico fresco" />
        </label>
      </form>
      <template #footer>
        <pv-button label="Cancelar" text @click="showProductForm = false" />
        <pv-button label="Guardar" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

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
import { reactive, ref, onMounted } from 'vue';
import { useProductsStore } from '../../application/products.store.js';

const productsStore = useProductsStore();
const showProductForm = ref(false);
const categoryOptions = ['Vegetales', 'Frutas', 'Lacteos', 'Organicos'];
const productForm = reactive({
  name: '',
  category: '',
  expirationDate: '',
  quantity: '',
  price: '',
  description: '',
});

const noopSubmit = () => {};

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
  border: 1px solid #d9e5f6;
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
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2,
.products-grid h3 {
  color: #021c45;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.products-grid p,
footer small {
  color: #526780;
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
  color: #fc6910;
  font-size: 18px;
  font-weight: 950;
}

.entity-form {
  display: grid;
  gap: 14px;
}

.entity-form label {
  color: #023192;
  display: grid;
  font-size: 13px;
  font-weight: 800;
  gap: 6px;
}

.form-row {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
</style>
