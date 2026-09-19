<template>
  <section class="procurements-view">
    <div class="view-header">
      <div>
        <span>Procurements</span>
        <h2>Ordenes de abastecimiento</h2>
        <p>Creacion, visualizacion, filtrado, aceptacion, rechazo y seguimiento de estado.</p>
      </div>
      <pv-button label="Crear orden" icon="pi pi-plus" @click="showOrderForm = true" />
    </div>

    <pv-dialog v-model:visible="showOrderForm" modal header="Crear orden" :style="{ width: '540px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          Proveedor
          <pv-input-text v-model="orderForm.supplier" placeholder="Anita Gamboa" />
        </label>
        <label>
          Minimarket
          <pv-input-text v-model="orderForm.minimarket" placeholder="Minimarket Verde Sur" />
        </label>
        <label>
          Productos
          <pv-input-text v-model="orderForm.items" placeholder="Leche organica, Queso organico" />
        </label>
        <div class="form-row">
          <label>
            Total estimado
            <pv-input-text v-model="orderForm.total" placeholder="315.80" />
          </label>
          <label>
            Estado
            <pv-select v-model="orderForm.status" :options="statusOptions" placeholder="Seleccionar estado" />
          </label>
        </div>
      </form>
      <template #footer>
        <pv-button label="Cancelar" text @click="showOrderForm = false" />
        <pv-button label="Guardar" icon="pi pi-save" disabled />
      </template>
    </pv-dialog>

    <div class="table-card">
      <pv-data-table :value="procurementsStore.orders" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="id" header="Orden" />
        <pv-column field="supplier" header="Proveedor" />
        <pv-column field="minimarket" header="Minimarket" />
        <pv-column field="itemCount" header="Items" />
        <pv-column field="total" header="Total" />
        <pv-column header="Estado">
          <template #body="{ data }">
            <span :class="['status-badge', `status-${data.status}`]">{{ data.status }}</span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useProcurementsStore } from '../../application/procurements.store.js';

const procurementsStore = useProcurementsStore();
const showOrderForm = ref(false);
const statusOptions = ['pending', 'approved', 'rejected'];
const orderForm = reactive({
  supplier: '',
  minimarket: 'Minimarket Verde Sur',
  items: '',
  total: '',
  status: 'pending',
});

onMounted(() => {
  procurementsStore.fetchOrders();
});
</script>

<style scoped>
.procurements-view {
  display: grid;
  gap: 18px;
}

.view-header,
.table-card {
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

.view-header span {
  color: #3d9f7d;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2 {
  color: #16251d;
  font-size: 26px;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p {
  color: #66756b;
  font-weight: 700;
  margin: 0;
}

.entity-form {
  display: grid;
  gap: 14px;
}

.entity-form label {
  color: #33423a;
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
