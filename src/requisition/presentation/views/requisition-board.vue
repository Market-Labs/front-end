<template>
  <section class="requisition-view">
    <div class="view-header">
      <div>
        <span>Requisition</span>
        <h2>Solicitudes internas de productos</h2>
        <p>Creacion, revision, aprobacion/rechazo y conversion a abastecimiento.</p>
      </div>
      <pv-button label="Nueva solicitud" icon="pi pi-plus" @click="requisitionStore.addDemoRequisition()" />
    </div>

    <div class="table-card">
      <pv-data-table :value="requisitionStore.requisitions" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="productName" header="Producto" />
        <pv-column field="requester" header="Solicitante" />
        <pv-column field="quantity" header="Cantidad" />
        <pv-column field="reason" header="Motivo" />
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
import { onMounted } from 'vue';
import { useRequisitionStore } from '../../application/requisition.store.js';

const requisitionStore = useRequisitionStore();

onMounted(() => {
  requisitionStore.fetchRequisitions();
});
</script>

<style scoped>
.requisition-view {
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
