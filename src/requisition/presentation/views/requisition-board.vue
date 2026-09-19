<template>
  <section class="requisition-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.requisition.eyebrow') }}</span>
        <h2>{{ $t('page.requisition.title') }}</h2>
        <p>{{ $t('page.requisition.description') }}</p>
      </div>
      <pv-button
        v-if="iamStore.isMinimarketAdmin"
        :label="$t('page.requisition.newRequest')"
        icon="pi pi-plus"
        @click="showRequisitionForm = true"
      />
    </div>

    <pv-dialog v-model:visible="showRequisitionForm" modal :header="$t('page.requisition.newRequest')" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('page.requisition.supplier') }}
          <pv-input-text v-model="requisitionForm.supplier" placeholder="Anita Gamboa" />
        </label>
        <label>
          {{ $t('common.product') }}
          <pv-input-text v-model="requisitionForm.productName" placeholder="Leche organica" />
        </label>
        <div class="form-row">
          <label>
            {{ $t('common.quantity') }}
            <pv-input-text v-model="requisitionForm.quantity" placeholder="30" />
          </label>
          <label>
            {{ $t('page.requisition.requester') }}
            <pv-input-text v-model="requisitionForm.requester" placeholder="Albino Caceres" />
          </label>
        </div>
        <label>
          {{ $t('page.requisition.reason') }}
          <pv-input-text v-model="requisitionForm.reason" placeholder="Reposicion de stock" />
        </label>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showRequisitionForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

    <div class="table-card">
      <pv-data-table :value="filteredRequisitions" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="id" :header="$t('page.requisition.request')" />
        <pv-column field="productName" :header="$t('common.product')" />
        <pv-column field="supplier" :header="$t('page.requisition.supplier')" />
        <pv-column field="requester" :header="$t('page.requisition.requester')" />
        <pv-column field="quantity" :header="$t('common.quantity')" />
        <pv-column field="reason" :header="$t('page.requisition.reason')" />
        <pv-column :header="$t('common.status')">
          <template #body="{ data }">
            <span :class="['status-badge', `status-${data.status}`]">{{ $t(`status.${data.status}`) }}</span>
          </template>
        </pv-column>
        <pv-column :header="$t('common.actions')">
          <template #body="{ data }">
            <div class="action-group">
              <pv-button
                v-if="iamStore.isSupplier && data.canBeReviewed"
                :label="$t('page.requisition.accept')"
                size="small"
                icon="pi pi-check"
                @click="acceptSupplyRequest(data)"
              />
              <pv-button
                v-if="iamStore.isSupplier && data.canBeReviewed"
                :label="$t('page.requisition.reject')"
                size="small"
                severity="danger"
                outlined
                icon="pi pi-times"
                @click="rejectSupplyRequest(data)"
              />
              <pv-button
                v-if="iamStore.isSupplier && data.canGenerateShippingOrder"
                :label="$t('page.requisition.createShippingOrder')"
                size="small"
                icon="pi pi-truck"
                @click="createShippingOrder(data)"
              />
              <span v-if="!hasAvailableAction(data)" class="muted-action">{{ $t('common.no_actions') }}</span>
            </div>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { useRequisitionStore } from '../../application/requisition.store.js';
import { useProcurementsStore } from '../../../procurements/application/procurements.store.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const requisitionStore = useRequisitionStore();
const procurementsStore = useProcurementsStore();
const iamStore = useIamStore();
const visibleRequisitions = computed(() => requisitionStore.visibleForUser(iamStore.currentUser));
const filteredRequisitions = useSearchFilter(() => visibleRequisitions.value);
const showRequisitionForm = ref(false);
const requisitionForm = reactive({
  supplier: 'Anita Gamboa',
  productName: '',
  quantity: '',
  requester: 'Albino Caceres',
  reason: '',
});

const noopSubmit = () => {};
const acceptSupplyRequest = (request) => requisitionStore.acceptRequest(request.id, iamStore.currentSupplierId);
const rejectSupplyRequest = (request) => requisitionStore.rejectRequest(request.id);
const createShippingOrder = (request) => {
  const orderId = procurementsStore.createFromSupplyRequest(request);
  requisitionStore.linkShippingOrder(request.id, orderId);
};
const hasAvailableAction = (request) => (
  iamStore.isSupplier && (request.canBeReviewed || request.canGenerateShippingOrder)
);

onMounted(() => {
  requisitionStore.fetchRequisitions();
  procurementsStore.fetchOrders();
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

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.muted-action {
  color: #526780;
  font-size: 12px;
  font-weight: 800;
}
</style>
