<template>
  <section class="inventory-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.inventory.eyebrow') }}</span>
        <h2>{{ $t('page.inventory.title') }}</h2>
        <p>{{ $t('page.inventory.description') }}</p>
      </div>
      <div class="view-actions"><pv-button :label="$t(iamStore.isSupplier ? 'page.inventory.registerWaste' : 'page.inventory.registerOutput')" icon="pi pi-minus" outlined @click="openWasteForm" /><pv-button :label="$t('page.inventory.registerStock')" icon="pi pi-plus" @click="openStockForm" /></div>
    </div>

    <pv-dialog v-model:visible="showStockForm" modal :header="$t('page.inventory.registerStock')" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('common.product') }}
          <pv-select v-model="stockForm.productId" :options="availableProducts" option-label="name" option-value="id" :placeholder="$t('page.requisition.selectProduct')" />
        </label>
        <div class="form-row">
          <label>
            {{ $t('page.inventory.lot') }}
            <pv-input-text v-model="stockForm.lotCode" placeholder="LOT-025" />
          </label>
          <label>
            {{ $t('common.expiration') }}
            <pv-input-text v-model="stockForm.expirationDate" type="date" />
          </label>
        </div>
        <div class="form-row">
          <label>
            Stock
            <pv-input-text v-model="stockForm.stock" type="number" min="0" step="1" placeholder="50" />
          </label>
          <label>
            {{ $t('page.inventory.minimumStock') }}
            <pv-input-text v-model="stockForm.minimumStock" type="number" min="0" step="1" placeholder="20" />
          </label>
        </div>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showStockForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" :loading="saving" @click="saveStock" />
      </template>
    </pv-dialog>

    <pv-dialog v-model:visible="showWasteForm" modal :header="$t(iamStore.isSupplier ? 'page.inventory.registerWaste' : 'page.inventory.registerOutput')" :style="{ width: 'min(520px, calc(100vw - 32px))' }">
      <form class="entity-form" @submit.prevent="saveWaste">
        <label>{{ $t('page.inventory.lot') }}<pv-select v-model="wasteForm.itemId" :options="inventoryStore.items.filter((item) => item.stock > 0)" option-label="productName" option-value="id" :placeholder="$t('page.inventory.selectLot')" /></label>
        <p v-if="selectedWasteItem" class="waste-lot">{{ selectedWasteItem.lotCode }} · {{ selectedWasteItem.stock }} {{ $t('page.inventory.units') }}</p>
        <label>{{ $t('common.quantity') }}<pv-input-text v-model="wasteForm.quantity" type="number" min="1" step="1" /></label>
        <label>{{ $t(iamStore.isSupplier ? 'page.inventory.wasteReason' : 'page.inventory.outputReason') }}<pv-select v-model="wasteForm.reason" :options="outputReasons" option-label="label" option-value="value" :placeholder="$t('page.inventory.selectReason')" /></label>
        <p v-if="wasteError" class="form-error" role="alert">{{ wasteError }}</p>
      </form>
      <template #footer><pv-button :label="$t('common.cancel')" text @click="showWasteForm = false" /><pv-button :label="$t('common.save')" icon="pi pi-save" :loading="savingWaste" @click="saveWaste" /></template>
    </pv-dialog>

    <div class="table-card">
      <pv-data-table :value="filteredItems" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="productName" :header="$t('common.product')" />
        <pv-column field="lotCode" :header="$t('page.inventory.lot')" />
        <pv-column field="stock" :header="$t('common.stock')" />
        <pv-column field="minimumStock" :header="$t('page.inventory.minimumStock')" />
        <pv-column field="expirationDate" :header="$t('common.expiration')" />
        <pv-column :header="$t('common.status')">
          <template #body="{ data }">
            <span :class="['status-badge', data.status === 'risk' ? 'status-risk' : 'status-healthy']">
              {{ $t(`status.${data.status}`) }}
            </span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { useInventoryStore } from '../../application/inventory.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useProductsStore } from '../../../products/application/products.store.js';
import { useI18n } from 'vue-i18n';

const inventoryStore = useInventoryStore();
const iamStore = useIamStore();
const productsStore = useProductsStore();
const { t } = useI18n();
const availableProducts = computed(() => iamStore.isSupplier
  ? productsStore.products.filter((product) => product.supplierId === iamStore.currentSupplierId)
  : productsStore.products);
const filteredItems = useSearchFilter(() => inventoryStore.items);
const showStockForm = ref(false);
const showWasteForm = ref(false);
const savingWaste = ref(false);
const wasteError = ref('');
const wasteForm = reactive({ itemId: null, quantity: '', reason: null });
const selectedWasteItem = computed(() => inventoryStore.items.find((item) => item.id === wasteForm.itemId));
const outputReasons = computed(() => [
  ...(iamStore.isSupplier ? [] : [{ value: 'dispatch', label: t('page.inventory.dispatch') }]),
  ...['expiration', 'handling', 'conservation'].map((value) => ({ value, label: t(`page.inventory.wasteReasons.${value}`) })),
]);
const saving = ref(false);
const formError = ref('');
const stockForm = reactive({
  productId: null,
  lotCode: '',
  expirationDate: '',
  stock: '',
  minimumStock: '',
});

const openStockForm = () => {
  Object.assign(stockForm, { productId: null, lotCode: '', expirationDate: '', stock: '', minimumStock: '' });
  formError.value = '';
  showStockForm.value = true;
};
const openWasteForm = () => {
  Object.assign(wasteForm, { itemId: null, quantity: '', reason: null });
  wasteError.value = '';
  showWasteForm.value = true;
};
const saveWaste = async () => {
  const quantity = Number(wasteForm.quantity);
  if (!selectedWasteItem.value || !Number.isInteger(quantity) || quantity <= 0 || quantity > selectedWasteItem.value.stock || !wasteForm.reason) {
    wasteError.value = t('common.invalidForm');
    return;
  }
  savingWaste.value = true;
  wasteError.value = '';
  try {
    if (wasteForm.reason === 'dispatch') {
      await inventoryStore.registerStockOutput({ itemId: wasteForm.itemId, quantity, ownerId: iamStore.currentMinimarketId });
    } else {
      await inventoryStore.registerWaste({ itemId: wasteForm.itemId, quantity, reason: wasteForm.reason, ownerId: iamStore.isSupplier ? iamStore.currentSupplierId : iamStore.currentMinimarketId, isSupplier: iamStore.isSupplier });
    }
    showWasteForm.value = false;
  } catch {
    wasteError.value = t('common.errorSaving');
  } finally {
    savingWaste.value = false;
  }
};
const saveStock = async () => {
  const product = availableProducts.value.find((entry) => entry.id === stockForm.productId);
  const stock = Number(stockForm.stock);
  const minimumStock = Number(stockForm.minimumStock);
  if (!product || !stockForm.lotCode.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(stockForm.expirationDate) || stockForm.stock === '' || stockForm.minimumStock === '' || !Number.isInteger(stock) || stock < 0 || !Number.isInteger(minimumStock) || minimumStock < 0) {
    formError.value = t('common.invalidForm');
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    await inventoryStore.registerStock({ productName: product.name, lotCode: stockForm.lotCode.trim(), expirationDate: stockForm.expirationDate, stock, minimumStock }, iamStore.isSupplier);
    showStockForm.value = false;
  } catch {
    formError.value = t('common.errorSaving');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  inventoryStore.fetchInventory(iamStore.isSupplier);
  inventoryStore.fetchWaste(iamStore.isSupplier);
  productsStore.fetchProducts();
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
.view-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.waste-lot { color: #526780; font-size: 13px; margin: 0; }

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
</style>
