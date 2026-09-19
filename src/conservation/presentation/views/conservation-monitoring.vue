<template>
  <section class="conservation-view">
    <div class="view-header">
      <div>
        <span>Conservation</span>
        <h2>Monitoreo de temperatura y humedad</h2>
        <p>Control de condiciones para conservacion de productos organicos.</p>
      </div>
      <pv-button label="Ver alertas" icon="pi pi-bell" @click="router.push('/communication')" />
    </div>

    <div class="table-card">
      <pv-data-table :value="conservationStore.records" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="zone" header="Zona" />
        <pv-column field="productName" header="Producto" />
        <pv-column field="temperature" header="Temp C" />
        <pv-column field="humidity" header="Humedad %" />
        <pv-column field="recordedAt" header="Registro" />
        <pv-column header="Estado">
          <template #body="{ data }">
            <span :class="['status-badge', data.isRisky ? 'status-risk' : 'status-healthy']">
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
import { useRouter } from 'vue-router';
import { useConservationStore } from '../../application/conservation.store.js';

const router = useRouter();
const conservationStore = useConservationStore();

onMounted(() => {
  conservationStore.fetchMonitoring();
});
</script>

<style scoped>
.conservation-view {
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
