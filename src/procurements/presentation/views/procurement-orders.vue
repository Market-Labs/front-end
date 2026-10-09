<template>
  <section class="procurements-view">
    <div class="view-header">
      <div>
        <span>{{ iamStore.isMinimarketAdmin ? $t('option.reception') : $t('page.procurements.eyebrow') }}</span>
        <h2>{{ iamStore.isMinimarketAdmin ? $t('option.reception') : $t('page.procurements.title') }}</h2>
        <p>{{ $t('page.procurements.description') }}</p>
      </div>
      <pv-button
        v-if="canCreate"
        :label="$t('page.procurements.createOrder')"
        icon="pi pi-plus"
        @click="openManualOrder"
      />
    </div>

    <pv-dialog v-model:visible="showOrderForm" modal :header="$t('page.procurements.createOrder')" :style="{ width: 'min(640px, calc(100vw - 32px))' }" @hide="closeOrderForm">
      <form class="entity-form" @submit.prevent>
        <label v-if="linkedRequest">{{ $t('page.requisition.request') }}<span class="read-only-value">{{ linkedRequest.id }}</span></label>
        <label>
          {{ $t('page.procurements.supplier') }}
          <span class="read-only-value">{{ iamStore.userName }}</span>
        </label>
        <label v-if="linkedRequest">{{ $t('common.minimarket') }}<span class="read-only-value">{{ linkedRequest.minimarket || linkedRequest.minimarketId }}</span></label>
        <label v-else>
          {{ $t('common.minimarket') }}
          <pv-select v-model="orderForm.minimarketId" :options="minimarkets" option-label="businessName" option-value="id" :placeholder="$t('page.procurements.selectMinimarket')" />
        </label>
        <div v-if="linkedRequest" class="detail-scroll">
          <table class="detail-table">
            <thead><tr><th>{{ $t('common.product') }}</th><th>{{ $t('common.quantity') }}</th><th>{{ $t('common.unitPrice') }}</th></tr></thead>
            <tbody><tr v-for="(item, index) in linkedItems" :key="index"><td>{{ item.productName }}</td><td>{{ item.quantity }}</td><td>{{ formatMoney(item.unitPrice) }}</td></tr></tbody>
          </table>
        </div>
        <div v-else class="items-field">
          <strong>{{ $t('common.items') }}</strong>
          <div v-for="(item, index) in orderForm.items" :key="item.key" class="item-row">
            <label>{{ $t('common.product') }}<pv-select v-model="item.productId" :options="availableProducts(index)" option-label="name" option-value="id" :placeholder="$t('page.procurements.selectProduct')" /></label>
            <label>{{ $t('common.quantity') }}<pv-input-text v-model="item.quantity" type="number" min="1" step="1" placeholder="1" /></label>
            <pv-button v-if="orderForm.items.length > 1" type="button" icon="pi pi-trash" text severity="danger" :aria-label="$t('common.removeItem')" :title="$t('common.removeItem')" @click="removeItem(index)" />
          </div>
          <pv-button type="button" :label="$t('common.addItem')" icon="pi pi-plus" text @click="addItem" />
        </div>
        <label>{{ $t('page.procurements.estimatedTotal') }}<span class="read-only-value">{{ estimatedTotal }}</span></label>
        <label>{{ $t('page.procurements.shippingDate') }}<pv-input-text v-model="orderForm.shippingDate" type="date" /></label>
        <label>{{ $t('common.status') }}<span class="read-only-value">{{ $t('status.pending-reception') }}</span></label>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="closeOrderForm" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" :loading="saving" @click="saveOrder" />
      </template>
    </pv-dialog>

    <pv-dialog v-model:visible="showDetails" modal :header="`${$t('page.procurements.order')} ${selectedOrder?.id || ''}`" :style="{ width: 'min(760px, calc(100vw - 32px))' }">
      <template v-if="selectedOrder">
        <dl class="detail-meta">
          <div><dt>{{ $t('page.procurements.supplier') }}</dt><dd>{{ selectedOrder.supplier }}</dd></div>
          <div><dt>{{ $t('common.minimarket') }}</dt><dd>{{ selectedOrder.minimarket }}</dd></div>
          <div><dt>{{ $t('common.status') }}</dt><dd>{{ $t(`status.${selectedOrder.status}`) }}</dd></div>
          <div><dt>{{ $t('common.createdAt') }}</dt><dd>{{ selectedOrder.createdAt }}</dd></div>
          <div><dt>{{ $t('page.procurements.shippingDate') }}</dt><dd>{{ selectedOrder.shippingDate || '-' }}</dd></div>
          <div v-if="selectedOrder.supplyRequestId"><dt>{{ $t('page.requisition.request') }}</dt><dd>{{ selectedOrder.supplyRequestId }}</dd></div>
          <div v-if="selectedOrder.observations"><dt>{{ $t('common.observations') }}</dt><dd>{{ selectedOrder.observations }}</dd></div>
          <div v-if="selectedOrder.rejectionReason"><dt>{{ $t('common.rejectionReason') }}</dt><dd>{{ selectedOrder.rejectionReason }}</dd></div>
        </dl>
        <div class="detail-scroll">
          <table class="detail-table">
            <thead><tr><th>{{ $t('common.product') }}</th><th>{{ $t('common.quantity') }}</th><th>{{ $t('common.unitPrice') }}</th><th>{{ $t('common.total') }}</th></tr></thead>
            <tbody><tr v-for="(item, index) in selectedOrder.items" :key="index"><td>{{ item.productName }}</td><td>{{ item.quantity }}</td><td>{{ formatMoney(item.unitPrice) }}</td><td>{{ formatMoney(item.quantity * item.unitPrice) }}</td></tr></tbody>
            <tfoot><tr><th colspan="3">{{ $t('common.total') }}</th><th>{{ formatMoney(selectedOrder.total) }}</th></tr></tfoot>
          </table>
        </div>
      </template>
    </pv-dialog>

    <p v-if="actionError" class="form-error" role="alert">{{ actionError }}</p>
    <div class="table-card">
      <pv-data-table :value="filteredOrders" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="id" :header="$t('page.procurements.order')" />
        <pv-column field="supplier" :header="$t('page.procurements.supplier')" />
        <pv-column field="minimarket" :header="$t('common.minimarket')" />
        <pv-column field="itemCount" :header="$t('common.items')" />
        <pv-column field="shippingDate" :header="$t('page.procurements.shippingDate')" />
        <pv-column :header="$t('common.total')"><template #body="{ data }">{{ formatMoney(data.total) }}</template></pv-column>
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
                :label="$t('page.procurements.acceptReception')"
                size="small"
                icon="pi pi-check"
                :loading="busyOrderId === data.id"
                @click="acceptReception(data)"
              />
              <pv-button
                v-if="canReview && data.canBeReviewed"
                :label="$t('page.procurements.rejectReception')"
                size="small"
                severity="danger"
                outlined
                icon="pi pi-times"
                :loading="busyOrderId === data.id"
                @click="rejectReception(data)"
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
import { useRoute, useRouter } from 'vue-router';
import { useProcurementsStore } from '../../application/procurements.store.js';
import { useRequisitionStore } from '../../../requisition/application/requisition.store.js';
import { useInventoryStore } from '../../../inventory/application/inventory.store.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { isFirebaseMode } from '../../../shared/infrastructure/firebase-client.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useProfilesStore } from '../../../profiles/application/profiles.store.js';
import { useProductsStore } from '../../../products/application/products.store.js';
import { useI18n } from 'vue-i18n';

const procurementsStore = useProcurementsStore();
const requisitionStore = useRequisitionStore();
const route = useRoute();
const router = useRouter();
const inventoryStore = useInventoryStore();
const iamStore = useIamStore();
const canCreate = computed(() => iamStore.currentUser?.permissions.includes('procurements:track'));
const canReview = computed(() => iamStore.currentUser?.permissions.includes('procurements:approve'));
const profilesStore = useProfilesStore();
const productsStore = useProductsStore();
const { t } = useI18n();
const visibleOrders = computed(() => procurementsStore.visibleForUser(iamStore.currentUser));
const filteredOrders = useSearchFilter(() => visibleOrders.value);
const showOrderForm = ref(false);
const linkedRequest = ref(null);
const saving = ref(false);
const formError = ref('');
const actionError = ref('');
const busyOrderId = ref(null);
const showDetails = ref(false);
const selectedOrderId = ref(null);
const selectedOrder = computed(() => procurementsStore.orders.find((order) => order.id === selectedOrderId.value));
const formatMoney = (value) => `S/ ${Number(value || 0).toFixed(2)}`;
let nextItemKey = 0;
const newItem = () => ({ key: nextItemKey++, productId: null, quantity: '' });
const minimarkets = computed(() => profilesStore.profiles.filter((profile) => profile.type === 'minimarket'));
const orderForm = reactive({
  minimarketId: null,
  shippingDate: new Date().toISOString().slice(0, 10),
  items: [newItem()],
});
const linkedItems = computed(() => linkedRequest.value?.items.map((item) => ({
  productName: item.productName,
  quantity: Number(item.quantity),
  unitPrice: Number(item.unitPrice ?? productsStore.products.find((product) => product.name === item.productName && product.supplierId === iamStore.currentSupplierId)?.price ?? 0),
})) || []);
const openManualOrder = () => {
  linkedRequest.value = null;
  formError.value = '';
  showOrderForm.value = true;
};
const closeOrderForm = () => {
  showOrderForm.value = false;
  linkedRequest.value = null;
  if (route.query.requestId) router.replace({ path: '/procurements' });
};
const addItem = () => orderForm.items.push(newItem());
const removeItem = (index) => orderForm.items.splice(index, 1);
const availableProducts = (index) => {
  const selected = new Set(orderForm.items.filter((_, itemIndex) => itemIndex !== index).map((item) => item.productId));
  return productsStore.products.filter((product) => !selected.has(product.id) && product.supplierId === iamStore.currentSupplierId);
};
const openDetails = (order) => {
  selectedOrderId.value = order.id;
  showDetails.value = true;
};
const estimatedTotal = computed(() => {
  if (linkedRequest.value) return formatMoney(linkedItems.value.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
  const total = orderForm.items.reduce((sum, item) => {
    const product = productsStore.products.find((entry) => entry.id === item.productId);
    const quantity = Number(item.quantity);
    return sum + (product && Number.isFinite(quantity) && quantity > 0 ? product.price * quantity : 0);
  }, 0);
  return formatMoney(total);
});

const saveOrder = async () => {
  if (linkedRequest.value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(orderForm.shippingDate) || linkedItems.value.length === 0
      || linkedItems.value.some((item) => !Number.isInteger(item.quantity) || item.quantity <= 0 || !Number.isFinite(item.unitPrice) || item.unitPrice <= 0)) {
      formError.value = t('common.invalidForm');
      return;
    }
    saving.value = true;
    formError.value = '';
    try {
      const orderId = await procurementsStore.createFromSupplyRequest(linkedRequest.value, productsStore.products, orderForm.shippingDate);
      if (isFirebaseMode) await requisitionStore.fetchRequisitions();
      else await requisitionStore.linkShippingOrder(linkedRequest.value.id, orderId);
      closeOrderForm();
    } catch {
      formError.value = t('common.errorSaving');
    } finally {
      saving.value = false;
    }
    return;
  }
  const minimarket = minimarkets.value.find((entry) => entry.id === orderForm.minimarketId);
  const items = orderForm.items.filter((line) => line.productId || line.quantity !== '').map((line) => {
    const product = productsStore.products.find((entry) => entry.id === line.productId && entry.supplierId === iamStore.currentSupplierId);
    return product && { productName: product.name, quantity: Number(line.quantity), unitPrice: product.price };
  });
  if (!minimarket || !/^\d{4}-\d{2}-\d{2}$/.test(orderForm.shippingDate) || items.length === 0 || items.some((item) => !item || !Number.isInteger(item.quantity) || item.quantity <= 0) || new Set(items.map((item) => item?.productName)).size !== items.length) {
    formError.value = t('common.invalidForm');
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    await procurementsStore.createOrder({ supplierId: iamStore.currentSupplierId, minimarketId: minimarket.id, supplier: iamStore.userName, minimarket: minimarket.businessName, shippingDate: orderForm.shippingDate, items, total: Number(items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0).toFixed(2)) });
    showOrderForm.value = false;
    orderForm.minimarketId = null;
    orderForm.items = [newItem()];
  } catch {
    formError.value = t('common.errorSaving');
  } finally {
    saving.value = false;
  }
};
const acceptReception = async (order) => {
  if (busyOrderId.value) return;
  busyOrderId.value = order.id;
  actionError.value = '';
  let changes = [];
  try {
    if (isFirebaseMode) {
      await procurementsStore.acceptReception(order.id, productsStore.products);
    } else {
      changes = await inventoryStore.receiveShipmentItems(order.items, productsStore.products, order.id);
      try {
        await procurementsStore.acceptReception(order.id);
      } catch (error) {
        await inventoryStore.restoreShipment(changes);
        throw error;
      }
    }
  } catch {
    actionError.value = t('page.procurements.receptionError');
  } finally {
    busyOrderId.value = null;
  }
};
const rejectReception = async (order) => {
  if (busyOrderId.value) return;
  busyOrderId.value = order.id;
  actionError.value = '';
  try {
    await procurementsStore.rejectReception(order.id);
  } catch {
    actionError.value = t('page.procurements.receptionError');
  } finally {
    busyOrderId.value = null;
  }
};

onMounted(async () => {
  const tasks = [procurementsStore.fetchOrders()];
  if (iamStore.isMinimarketAdmin) {
    tasks.push(inventoryStore.fetchInventory(), productsStore.fetchProducts());
  }
  if (iamStore.isSupplier) {
    tasks.push(profilesStore.fetchProfiles(), productsStore.fetchProducts(), requisitionStore.fetchRequisitions());
  }
  await Promise.all(tasks);
  if (typeof route.query.requestId === 'string' && canCreate.value) {
    const request = requisitionStore.visibleForUser(iamStore.currentUser)
      .find((entry) => entry.id === route.query.requestId && entry.canGenerateShippingOrder);
    if (request) {
      linkedRequest.value = request;
      formError.value = '';
      showOrderForm.value = true;
    }
  }
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
.detail-table { border-collapse: collapse; min-width: 480px; width: 100%; }
.detail-table th, .detail-table td { border-bottom: 1px solid #d9e5f6; padding: 10px 8px; text-align: left; }
.detail-table th:not(:first-child), .detail-table td:not(:first-child) { text-align: right; }
@media (max-width: 540px) {
  .detail-meta { grid-template-columns: 1fr; }
  .item-row { grid-template-columns: minmax(0, 1fr) minmax(0, 80px) 36px; }
}
</style>
