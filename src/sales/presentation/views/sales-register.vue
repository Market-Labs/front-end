<template>
  <section class="sales-view">
    <div class="view-header">
      <div><span>{{ $t('option.sales') }}</span><h2>{{ $t('page.sales.title') }}</h2><p>{{ $t(iamStore.isSupplier ? 'page.sales.supplierDescription' : 'page.sales.adminDescription') }}</p></div>
      <pv-button v-if="iamStore.isMinimarketAdmin" :label="$t('page.sales.newSale')" icon="pi pi-plus" @click="openForm" />
    </div>

    <pv-dialog v-model:visible="showForm" modal :header="$t('page.sales.newSale')" :style="{ width: 'min(680px, calc(100vw - 32px))' }">
      <form class="sale-form" @submit.prevent="saveSale">
        <label>{{ $t('page.sales.customer') }}<pv-input-text v-model.trim="form.customer" required /></label>
        <div class="line-head"><strong>{{ $t('common.items') }}</strong><pv-button :label="$t('common.addItem')" icon="pi pi-plus" text @click="addLine" /></div>
        <div v-for="(line, index) in form.items" :key="line.key" class="line-row">
          <label>{{ $t('common.product') }}<pv-select v-model="line.productId" :options="availableProducts(index)" option-label="name" option-value="id" :placeholder="$t('page.requisition.selectProduct')" /></label>
          <label>{{ $t('common.quantity') }}<pv-input-text v-model="line.quantity" type="number" min="1" step="1" /></label>
          <pv-button v-if="form.items.length > 1" icon="pi pi-trash" text severity="danger" :aria-label="$t('common.removeItem')" @click="form.items.splice(index, 1)" />
        </div>
        <div class="form-bottom"><label>{{ $t('page.sales.discount') }}<pv-input-text v-model="form.discount" type="number" min="0" step="0.01" /></label><div><span>{{ $t('common.total') }}</span><strong>{{ money(estimatedTotal) }}</strong></div></div>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      </form>
      <template #footer><pv-button :label="$t('common.cancel')" text @click="showForm = false" /><pv-button :label="$t('common.save')" icon="pi pi-save" :loading="salesStore.saving" @click="saveSale" /></template>
    </pv-dialog>

    <pv-dialog v-model:visible="showDetails" modal :header="`${$t('page.sales.sale')} ${selectedSale?.id || ''}`" :style="{ width: 'min(740px, calc(100vw - 32px))' }">
      <template v-if="selectedSale">
        <div class="detail-meta"><span>{{ $t('page.sales.customer') }}: {{ selectedSale.customer }}</span><span>{{ $t('page.sales.date') }}: {{ displayDate(selectedSale.occurredAt) }}</span><span v-if="selectedSale.sourceOrderId">{{ $t('page.procurements.order') }}: {{ selectedSale.sourceOrderId }}</span></div>
        <div class="table-scroll"><table class="line-table"><thead><tr><th>{{ $t('common.product') }}</th><th>{{ $t('common.quantity') }}</th><th>{{ $t('common.unitPrice') }}</th><th>{{ $t('common.total') }}</th></tr></thead><tbody><tr v-for="(item, index) in selectedSale.items" :key="index"><td>{{ item.productName }}</td><td>{{ item.quantity }}</td><td>{{ money(item.unitPrice) }}</td><td>{{ money(item.quantity * item.unitPrice) }}</td></tr></tbody><tfoot><tr><th colspan="3">{{ $t('page.sales.discount') }}</th><th>{{ money(selectedSale.discount) }}</th></tr><tr><th colspan="3">{{ $t('common.total') }}</th><th>{{ money(selectedSale.total) }}</th></tr></tfoot></table></div>
      </template>
    </pv-dialog>

    <div class="table-card"><pv-data-table :value="filteredSales" class="marketgo-datatable" responsive-layout="scroll">
      <pv-column field="id" :header="$t('page.sales.sale')" />
      <pv-column :header="$t('page.sales.date')"><template #body="{ data }">{{ displayDate(data.occurredAt) }}</template></pv-column>
      <pv-column field="customer" :header="$t('page.sales.customer')" />
      <pv-column field="itemCount" :header="$t('common.items')" />
      <pv-column :header="$t('common.total')"><template #body="{ data }">{{ money(data.total) }}</template></pv-column>
      <pv-column :header="$t('common.actions')"><template #body="{ data }"><pv-button :label="$t('common.viewDetails')" icon="pi pi-eye" size="small" outlined @click="selectedSale = data; showDetails = true" /></template></pv-column>
      <template #empty>{{ $t('page.sales.empty') }}</template>
    </pv-data-table></div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useSalesStore } from '../../application/sales.store.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useProcurementsStore } from '../../../procurements/application/procurements.store.js';
import { useInventoryStore } from '../../../inventory/application/inventory.store.js';
import { useProductsStore } from '../../../products/application/products.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const { t, locale } = useI18n();
const salesStore = useSalesStore();
const iamStore = useIamStore();
const procurementsStore = useProcurementsStore();
const inventoryStore = useInventoryStore();
const productsStore = useProductsStore();
const money = (value) => `S/ ${Number(value || 0).toFixed(2)}`;
const displayDate = (value) => value ? new Date(value).toLocaleString(locale.value === 'es' ? 'es-PE' : 'en-US') : '-';
const visibleSales = computed(() => iamStore.isSupplier
  ? salesStore.supplierSales.filter((sale) => sale.supplierId === iamStore.currentSupplierId)
  : salesStore.retailSales.filter((sale) => sale.minimarketId === iamStore.currentMinimarketId));
const filteredSales = useSearchFilter(() => visibleSales.value);
const showForm = ref(false);
const showDetails = ref(false);
const selectedSale = ref(null);
const formError = ref('');
let nextKey = 0;
const newLine = () => ({ key: nextKey++, productId: null, quantity: '' });
const form = reactive({ customer: '', discount: '0', items: [newLine()] });
const stockFor = (name) => inventoryStore.items.filter((item) => item.productName === name).reduce((sum, item) => sum + item.stock, 0);
const availableProducts = (index) => {
  const selected = new Set(form.items.filter((_, i) => i !== index).map((item) => item.productId));
  return productsStore.products.filter((product) => !selected.has(product.id) && product.available && stockFor(product.name) > 0);
};
const estimatedTotal = computed(() => Math.max(0, form.items.reduce((sum, line) => {
  const product = productsStore.products.find((entry) => entry.id === line.productId);
  return sum + (product ? product.price * (Number(line.quantity) || 0) : 0);
}, 0) - (Number(form.discount) || 0)));
const addLine = () => form.items.push(newLine());
const openForm = () => { Object.assign(form, { customer: '', discount: '0', items: [newLine()] }); formError.value = ''; showForm.value = true; };
const saveSale = async () => {
  const items = form.items.map((line) => {
    const product = productsStore.products.find((entry) => entry.id === line.productId);
    return product && { productId: product.id, productName: product.name, quantity: Number(line.quantity), unitPrice: product.price };
  });
  const discount = Number(form.discount);
  const subtotal = items.reduce((sum, item) => sum + (item ? item.quantity * item.unitPrice : 0), 0);
  if (!form.customer.trim() || items.some((item) => !item || !Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > stockFor(item.productName)) || new Set(items.map((item) => item?.productId)).size !== items.length || !Number.isFinite(discount) || discount < 0 || discount > subtotal) {
    formError.value = t('common.invalidForm');
    return;
  }
  formError.value = '';
  try {
    await salesStore.createRetailSale({ minimarketId: iamStore.currentMinimarketId, customer: form.customer.trim(), occurredAt: new Date().toISOString(), discount, items, type: 'retail' });
    showForm.value = false;
  } catch {
    formError.value = salesStore.error === 'Stock insuficiente.' ? t('page.sales.insufficientStock') : t('common.errorSaving');
  }
};
onMounted(() => { salesStore.fetchSales(); procurementsStore.fetchOrders(); if (iamStore.isMinimarketAdmin) { inventoryStore.fetchInventory(); productsStore.fetchProducts(); } });
</script>

<style scoped>
.sales-view { display: grid; gap: 18px; }
.view-header, .table-card { background: #fff; border: 1px solid #d9e5f6; border-radius: 8px; box-shadow: 0 12px 26px rgba(15, 23, 42, .05); }
.view-header { align-items: center; display: flex; justify-content: space-between; gap: 16px; padding: 24px; }
.view-header span { color: #0d8cfb; font-size: 12px; font-weight: 900; text-transform: uppercase; }
.view-header h2 { color: #021c45; font-size: 26px; font-weight: 950; margin: 6px 0; }
.view-header p { color: #526780; font-weight: 700; margin: 0; }
.sale-form { display: grid; gap: 16px; }
.sale-form label { color: #023192; display: grid; font-size: 13px; font-weight: 800; gap: 6px; min-width: 0; }
.line-head, .form-bottom { align-items: center; display: flex; justify-content: space-between; gap: 12px; }
.line-head strong, .form-bottom strong { color: #021c45; }
.line-row { align-items: end; display: grid; grid-template-columns: minmax(0, 1fr) 96px 36px; gap: 10px; }
.line-row :deep(.p-select), .line-row :deep(.p-inputtext) { min-width: 0; width: 100%; }
.form-bottom label { flex: 0 0 130px; }
.form-bottom div { display: grid; text-align: right; }
.form-error { color: #b42318; margin: 0; font-weight: 700; }
.detail-meta { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-bottom: 18px; color: #023192; font-weight: 700; }
.table-scroll { overflow-x: auto; }
.line-table { border-collapse: collapse; min-width: 480px; width: 100%; }
.line-table td, .line-table th { border-bottom: 1px solid #d9e5f6; padding: 10px 8px; text-align: left; }
.line-table td:not(:first-child), .line-table th:not(:first-child) { text-align: right; }
@media (max-width: 650px) { .view-header { align-items: flex-start; flex-direction: column; padding: 16px; } }
</style>
