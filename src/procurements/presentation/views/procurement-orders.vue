<template>
  <section class="procurements-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.procurements.eyebrow') }}</span>
        <h2>{{ $t('page.procurements.title') }}</h2>
        <p>{{ $t('page.procurements.description') }}</p>
      </div>
      <pv-button :label="$t('page.procurements.createOrder')" icon="pi pi-plus" @click="showOrderForm = true" />
    </div>

    <pv-dialog v-model:visible="showOrderForm" modal :header="$t('page.procurements.createOrder')" :style="{ width: '540px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('page.procurements.supplier') }}
          <pv-input-text v-model="orderForm.supplier" placeholder="Anita Gamboa" />
        </label>
        <label>
          Minimarket
          <pv-input-text v-model="orderForm.minimarket" placeholder="Minimarket Verde Sur" />
        </label>
        <label>
          {{ $t('option.products') }}
          <pv-input-text v-model="orderForm.items" placeholder="Leche organica, Queso organico" />
        </label>
        <div class="form-row">
          <label>
            {{ $t('page.procurements.estimatedTotal') }}
            <pv-input-text v-model="orderForm.total" placeholder="315.80" />
          </label>
          <label>
            {{ $t('common.status') }}
            <pv-select v-model="orderForm.status" :options="statusOptions" :placeholder="$t('page.procurements.selectStatus')" />
          </label>
        </div>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showOrderForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

    <div class="table-card">
      <pv-data-table :value="filteredOrders" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="id" :header="$t('page.procurements.order')" />
        <pv-column field="supplier" :header="$t('page.procurements.supplier')" />
        <pv-column field="minimarket" header="Minimarket" />
        <pv-column field="itemCount" header="Items" />
        <pv-column field="total" header="Total" />
        <pv-column :header="$t('common.status')">
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
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const procurementsStore = useProcurementsStore();
const filteredOrders = useSearchFilter(() => procurementsStore.orders);
const showOrderForm = ref(false);
const statusOptions = ['pending', 'approved', 'rejected'];
const orderForm = reactive({
  supplier: '',
  minimarket: 'Minimarket Verde Sur',
  items: '',
  total: '',
  status: 'pending',
});

const noopSubmit = () => {};

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
