<template>
  <section class="inventory-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.inventory.eyebrow') }}</span>
        <h2>{{ $t('page.inventory.title') }}</h2>
        <p>{{ $t('page.inventory.description') }}</p>
      </div>
      <pv-button :label="$t('page.inventory.registerStock')" icon="pi pi-plus" @click="showStockForm = true" />
    </div>

    <pv-dialog v-model:visible="showStockForm" modal :header="$t('page.inventory.registerStock')" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('common.product') }}
          <pv-input-text v-model="stockForm.productName" placeholder="Tomate organico" />
        </label>
        <div class="form-row">
          <label>
            {{ $t('page.inventory.lot') }}
            <pv-input-text v-model="stockForm.lotCode" placeholder="LOT-025" />
          </label>
          <label>
            {{ $t('common.expiration') }}
            <pv-input-text v-model="stockForm.expirationDate" placeholder="2026-10-01" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Stock
            <pv-input-text v-model="stockForm.stock" placeholder="50" />
          </label>
          <label>
            {{ $t('page.inventory.minimumStock') }}
            <pv-input-text v-model="stockForm.minimumStock" placeholder="20" />
          </label>
        </div>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showStockForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

    <div class="table-card">
      <pv-data-table :value="filteredItems" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="productName" :header="$t('common.product')" />
        <pv-column field="lotCode" :header="$t('page.inventory.lot')" />
        <pv-column field="stock" header="Stock" />
        <pv-column field="minimumStock" :header="$t('page.inventory.minimumStock')" />
        <pv-column field="expirationDate" :header="$t('common.expiration')" />
        <pv-column :header="$t('common.status')">
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
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const inventoryStore = useInventoryStore();
const filteredItems = useSearchFilter(() => inventoryStore.items);
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
