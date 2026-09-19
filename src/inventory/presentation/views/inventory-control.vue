<template>
  <section class="inventory-view">
    <div class="view-header">
      <div>
        <span>Inventory</span>
        <h2>Inventario, lotes y vencimientos</h2>
        <p>Control de stock, lotes, fechas de vencimiento y estados de riesgo.</p>
      </div>
      <pv-button label="Registrar stock" icon="pi pi-plus" @click="showStockForm = true" />
    </div>

    <pv-dialog v-model:visible="showStockForm" modal header="Registrar stock" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          Producto
          <pv-input-text v-model="stockForm.productName" placeholder="Tomate organico" />
        </label>
        <div class="form-row">
          <label>
            Lote
            <pv-input-text v-model="stockForm.lotCode" placeholder="LOT-025" />
          </label>
          <label>
            Vencimiento
            <pv-input-text v-model="stockForm.expirationDate" placeholder="2026-10-01" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Stock
            <pv-input-text v-model="stockForm.stock" placeholder="50" />
          </label>
          <label>
            Stock minimo
            <pv-input-text v-model="stockForm.minimumStock" placeholder="20" />
          </label>
        </div>
      </form>
      <template #footer>
        <pv-button label="Cancelar" text @click="showStockForm = false" />
        <pv-button label="Guardar" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

    <div class="table-card">
      <pv-data-table :value="inventoryStore.items" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="productName" header="Producto" />
        <pv-column field="lotCode" header="Lote" />
        <pv-column field="stock" header="Stock" />
        <pv-column field="minimumStock" header="Minimo" />
        <pv-column field="expirationDate" header="Vencimiento" />
        <pv-column header="Estado">
          <template #body="{ data }">
            <span :class="['status-badge', data.status === 'risk' ? 'status-risk' : 'status-healthy']">
              {{ data.status }}
            </span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const inventoryStore = useInventoryStore();
const showStockForm = ref(false);
const stockForm = reactive({
  productName: '',
  lotCode: '',
  expirationDate: '',
  stock: '',
  minimumStock: '',
});

const noopSubmit = () => {};

onMounted(() => {
  inventoryStore.fetchInventory();
});
</script>

<style scoped>
.inventory-view {
  display: grid;
  gap: 18px;
}

.view-header,
.table-card {
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

.view-header span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2 {
  color: #021c45;
  font-size: 26px;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p {
  color: #526780;
  font-weight: 700;
  margin: 0;
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
