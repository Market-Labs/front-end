<template>
  <section class="inventory-view">
    <div class="view-header">
      <div>
        <span>Inventory</span>
        <h2>Inventario, lotes y vencimientos</h2>
        <p>Control de stock, lotes, fechas de vencimiento y estados de riesgo.</p>
      </div>
      <pv-button label="Registrar stock" icon="pi pi-plus" />
    </div>

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
import { onMounted } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';

const inventoryStore = useInventoryStore();

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
</style>
