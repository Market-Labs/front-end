<template>
  <section class="suppliers-view">
    <div class="view-header">
      <div>
        <span>Suppliers</span>
        <h2>Directorio de proveedores</h2>
        <p>Gestion de datos comerciales, especialidad y cobertura de proveedores.</p>
      </div>
      <pv-button label="Nuevo proveedor" icon="pi pi-plus" @click="showSupplierForm = true" />
    </div>

    <pv-dialog v-model:visible="showSupplierForm" modal header="Nuevo proveedor" :style="{ width: '540px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          Nombre comercial
          <pv-input-text v-model="supplierForm.businessName" placeholder="Anita Gamboa" />
        </label>
        <div class="form-row">
          <label>
            RUC
            <pv-input-text v-model="supplierForm.ruc" placeholder="10456789012" />
          </label>
          <label>
            Telefono
            <pv-input-text v-model="supplierForm.phone" placeholder="+51 959 404 210" />
          </label>
        </div>
        <label>
          Correo
          <pv-input-text v-model="supplierForm.email" placeholder="anitaG@bioandes.pe" />
        </label>
        <label>
          Direccion
          <pv-input-text v-model="supplierForm.address" placeholder="Cerro Colorado, Arequipa" />
        </label>
        <div class="form-row">
          <label>
            Especialidad
            <pv-input-text v-model="supplierForm.specialty" placeholder="Lacteos y derivados" />
          </label>
          <label>
            Cobertura
            <pv-input-text v-model="supplierForm.coverageArea" placeholder="Cerro Colorado - Arequipa" />
          </label>
        </div>
      </form>
      <template #footer>
        <pv-button label="Cancelar" text @click="showSupplierForm = false" />
        <pv-button label="Guardar" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

    <div class="supplier-grid">
      <article v-for="supplier in suppliersStore.suppliers" :key="supplier.id">
        <span>{{ supplier.ruc }}</span>
        <h3>{{ supplier.businessName }}</h3>
        <p>{{ supplier.specialty }}</p>
        <footer>
          <small>{{ supplier.coverageArea }}</small>
          <strong>{{ supplier.phone }}</strong>
        </footer>
      </article>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useSuppliersStore } from '../../application/suppliers.store.js';

const suppliersStore = useSuppliersStore();
const showSupplierForm = ref(false);
const supplierForm = reactive({
  businessName: '',
  ruc: '',
  email: '',
  phone: '',
  address: '',
  specialty: '',
  coverageArea: '',
});

const noopSubmit = () => {};

onMounted(() => {
  suppliersStore.fetchSuppliers();
});
</script>

<style scoped>
.suppliers-view {
  display: grid;
  gap: 18px;
}

.view-header,
.supplier-grid article {
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
.supplier-grid span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2,
.supplier-grid h3 {
  color: #021c45;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.supplier-grid p,
footer small {
  color: #526780;
  font-weight: 700;
}

.supplier-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.supplier-grid article {
  padding: 22px;
}

footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}

footer strong {
  color: #fc6910;
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
