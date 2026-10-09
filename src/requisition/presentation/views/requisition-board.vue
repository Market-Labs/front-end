<template>
  <section class="requisition-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.requisition.eyebrow') }}</span>
        <h2>{{ $t('page.requisition.title') }}</h2>
        <p>{{ $t('page.requisition.description') }}</p>
      </div>
      <pv-button
        v-if="iamStore.isMinimarketAdmin && canCreate"
        :label="$t('page.requisition.newRequest')"
        icon="pi pi-plus"
        @click="showRequisitionForm = true"
      />
    </div>

    <pv-dialog v-model:visible="showRequisitionForm" modal :header="$t('page.requisition.newRequest')" :style="{ width: 'min(640px, calc(100vw - 32px))' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('page.requisition.supplier') }}
          <pv-select v-model="requisitionForm.supplierId" :options="suppliersStore.activeSuppliers" option-label="businessName" option-value="id" :placeholder="$t('page.requisition.selectSupplier')" />
        </label>
        <div class="items-field">
          <strong>{{ $t('common.items') }}</strong>
          <div v-for="(item, index) in requisitionForm.items" :key="item.key" class="item-row">
            <label>
              {{ $t('common.product') }}
              <pv-select v-model="item.productId" :options="availableProducts(index)" option-label="name" option-value="id" :placeholder="$t('page.requisition.selectProduct')" />
            </label>
            <label>
              {{ $t('common.quantity') }}
              <pv-input-text v-model="item.quantity" type="number" min="1" step="1" placeholder="1" />
            </label>
            <pv-button v-if="requisitionForm.items.length > 1" type="button" icon="pi pi-trash" text severity="danger" :aria-label="$t('common.removeItem')" :title="$t('common.removeItem')" @click="removeItem(index)" />
          </div>
          <pv-button type="button" :label="$t('common.addItem')" icon="pi pi-plus" text @click="addItem" />
        </div>
        <label>{{ $t('page.requisition.requester') }}<span class="read-only-value">{{ iamStore.userName }}</span></label>
        <label>
          {{ $t('page.requisition.reason') }}
          <pv-select v-model="requisitionForm.reason" :options="reasonOptions" :placeholder="$t('page.requisition.selectReason')" />
        </label>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showRequisitionForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" :loading="saving" @click="saveRequest" />
      </template>
    </pv-dialog>

    <pv-dialog v-model:visible="showDetails" modal :header="`${$t('page.requisition.request')} ${selectedRequest?.id || ''}`" :style="{ width: 'min(680px, calc(100vw - 32px))' }">
      <template v-if="selectedRequest">
        <dl class="detail-meta">
          <div><dt>{{ $t('page.requisition.supplier') }}</dt><dd>{{ selectedRequest.supplier }}</dd></div>
          <div><dt>{{ $t('page.requisition.requester') }}</dt><dd>{{ selectedRequest.requester }}</dd></div>
          <div><dt>{{ $t('common.status') }}</dt><dd>{{ $t(`status.${selectedRequest.status}`) }}</dd></div>
          <div><dt>{{ $t('common.createdAt') }}</dt><dd>{{ selectedRequest.createdAt }}</dd></div>
          <div><dt>{{ $t('page.requisition.reason') }}</dt><dd>{{ selectedRequest.reason }}</dd></div>
          <div v-if="selectedRequest.shippingOrderId"><dt>{{ $t('page.procurements.order') }}</dt><dd>{{ selectedRequest.shippingOrderId }}</dd></div>
          <div v-if="selectedRequest.rejectionReason"><dt>{{ $t('common.rejectionReason') }}</dt><dd>{{ selectedRequest.rejectionReason }}</dd></div>
        </dl>
        <div class="detail-scroll">
          <table class="detail-table">
            <thead><tr><th>{{ $t('common.product') }}</th><th>{{ $t('common.quantity') }}</th></tr></thead>
            <tbody><tr v-for="(item, index) in selectedRequest.items" :key="index"><td>{{ item.productName }}</td><td>{{ item.quantity }}</td></tr></tbody>
            <tfoot><tr><th>{{ $t('common.total') }}</th><th>{{ selectedRequest.totalQuantity }}</th></tr></tfoot>
          </table>
        </div>
      </template>
    </pv-dialog>

    <p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p>
    <div class="table-card">
      <pv-data-table :value="filteredRequisitions" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="id" :header="$t('page.requisition.request')" />
        <pv-column field="itemCount" :header="$t('common.items')" />
        <pv-column field="supplier" :header="$t('page.requisition.supplier')" />
        <pv-column field="requester" :header="$t('page.requisition.requester')" />
        <pv-column field="totalQuantity" :header="$t('common.quantity')" />
        <pv-column field="reason" :header="$t('page.requisition.reason')" />
        <pv-column :header="$t('common.status')">
          <template #body="{ data }">
            <span :class="['status-badge', `status-${data.status}`]">{{ $t(`status.${data.status}`) }}</span>
          </template>
        </pv-column>
        <pv-column :header="$t('common.actions')">
          <template #body="{ data }">
            <div class="action-group">
              <pv-button :label="$t('common.viewDetails')" size="small" icon="pi pi-eye" outlined @click="openDetails(data)" />
              <pv-button
                v-if="canReview && data.canBeReviewed"
                :label="$t('page.requisition.accept')"
                size="small"
                icon="pi pi-check"
                :disabled="!!busyRequestId"
                @click="acceptSupplyRequest(data)"
              />
              <pv-button
                v-if="canReview && data.canBeReviewed"
                :label="$t('page.requisition.reject')"
                size="small"
                severity="danger"
                outlined
                icon="pi pi-times"
                :disabled="!!busyRequestId"
                @click="rejectSupplyRequest(data)"
              />
              <pv-button
                v-if="canReview && data.canGenerateShippingOrder"
                :label="$t('page.requisition.createShippingOrder')"
                size="small"
                icon="pi pi-truck"
                :disabled="!!busyRequestId"
                @click="createShippingOrder(data)"
              />
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
import { useRouter } from 'vue-router';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useProductsStore } from '../../../products/application/products.store.js';
import { useSuppliersStore } from '../../../suppliers/application/suppliers.store.js';
import { useI18n } from 'vue-i18n';

const requisitionStore = useRequisitionStore();
const router = useRouter();
const iamStore = useIamStore();
const canCreate = computed(() => iamStore.currentUser?.permissions.includes('inventory:write'));
const canReview = computed(() => iamStore.currentUser?.permissions.includes('procurements:track'));
const productsStore = useProductsStore();
const suppliersStore = useSuppliersStore();
const { t } = useI18n();
const reasonOptions = computed(() => [
  t('page.requisition.restockReason'),
  t('page.requisition.demandReason'),
  t('page.requisition.expirationReason'),
]);
const visibleRequisitions = computed(() => requisitionStore.visibleForUser(iamStore.currentUser));
const filteredRequisitions = useSearchFilter(() => visibleRequisitions.value);
const showRequisitionForm = ref(false);
const saving = ref(false);
const formError = ref('');
const actionError = ref('');
const busyRequestId = ref(null);
const showDetails = ref(false);
const selectedRequestId = ref(null);
const selectedRequest = computed(() => requisitionStore.requisitions.find((request) => request.id === selectedRequestId.value));
let nextItemKey = 0;
const newItem = () => ({ key: nextItemKey++, productId: null, quantity: '' });
const requisitionForm = reactive({
  supplierId: null,
  items: [newItem()],
  reason: null,
});
const addItem = () => requisitionForm.items.push(newItem());
const removeItem = (index) => requisitionForm.items.splice(index, 1);
const availableProducts = (index) => {
  const selected = new Set(requisitionForm.items.filter((_, itemIndex) => itemIndex !== index).map((item) => item.productId));
  return productsStore.products.filter((product) => !selected.has(product.id) && product.supplierId === requisitionForm.supplierId);
};
const openDetails = (request) => {
  selectedRequestId.value = request.id;
  showDetails.value = true;
};

const saveRequest = async () => {
  const supplier = suppliersStore.activeSuppliers.find((entry) => entry.id === requisitionForm.supplierId);
  const items = requisitionForm.items.filter((line) => line.productId || line.quantity !== '').map((line) => {
    const product = productsStore.products.find((entry) => entry.id === line.productId && entry.supplierId === requisitionForm.supplierId);
    return product && { productName: product.name, quantity: Number(line.quantity), unitPrice: product.price };
  });
  if (!supplier || !requisitionForm.reason || items.length === 0 || items.some((item) => !item || !Number.isInteger(item.quantity) || item.quantity <= 0) || new Set(items.map((item) => item?.productName)).size !== items.length) {
    formError.value = t('common.invalidForm');
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    await requisitionStore.createRequest({ minimarketId: iamStore.currentMinimarketId, supplierId: supplier.id, requesterId: iamStore.currentUser.id, requester: iamStore.userName, supplier: supplier.businessName, productName: items[0].productName, quantity: items[0].quantity, reason: requisitionForm.reason, items });
    showRequisitionForm.value = false;
    requisitionForm.supplierId = null;
    requisitionForm.reason = null;
    requisitionForm.items = [newItem()];
  } catch {
    formError.value = t('common.errorSaving');
  } finally {
    saving.value = false;
  }
};
const runAction = async (request, action) => {
  busyRequestId.value = request.id;
  actionError.value = '';
  try { await action(); } catch { actionError.value = t('common.errorSaving'); }
  finally { busyRequestId.value = null; }
};
const acceptSupplyRequest = (request) => runAction(request, () => requisitionStore.acceptRequest(request.id, iamStore.currentSupplierId));
const rejectSupplyRequest = (request) => runAction(request, () => requisitionStore.rejectRequest(request.id));
const createShippingOrder = (request) => router.push({ path: '/procurements', query: { requestId: request.id } });

onMounted(() => {
  requisitionStore.fetchRequisitions();
  productsStore.fetchProducts();
  if (iamStore.isMinimarketAdmin) {
    suppliersStore.fetchSuppliers();
  }
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
.form-error { color: #bc2d2d; font-weight: 700; margin: 0; }

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

.read-only-value {
  align-items: center;
  background: #eff3fa;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  color: #023192;
  display: flex;
  min-height: 42px;
  padding: 0 12px;
}

.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.items-field { display: grid; gap: 8px; }
.items-field strong { color: #023192; font-size: 13px; }
.item-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 100px) 36px; gap: 10px; align-items: end; }
.item-row label { min-width: 0; }
.item-row :deep(.p-select), .item-row :deep(.p-inputtext) { min-width: 0; width: 100%; }
.detail-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 0 0 20px; }
.detail-meta div { min-width: 0; }
.detail-meta dt { color: #526780; font-size: 12px; font-weight: 700; }
.detail-meta dd { color: #021c45; font-weight: 700; margin: 3px 0 0; overflow-wrap: anywhere; }
.detail-scroll { overflow-x: auto; }
.detail-table { border-collapse: collapse; width: 100%; min-width: 340px; }
.detail-table th, .detail-table td { border-bottom: 1px solid #d9e5f6; padding: 10px 8px; text-align: left; }
.detail-table th:last-child, .detail-table td:last-child { text-align: right; }
@media (max-width: 540px) {
  .detail-meta { grid-template-columns: 1fr; }
  .item-row { grid-template-columns: minmax(0, 1fr) minmax(0, 80px) 36px; }
}
</style>
