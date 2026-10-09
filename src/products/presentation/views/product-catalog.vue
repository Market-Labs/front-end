<template>
  <section class="products-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.products.eyebrow') }}</span>
        <h2>{{ $t('page.products.title') }}</h2>
        <p>{{ $t('page.products.description') }}</p>
      </div>
      <pv-button :label="$t('page.products.newProduct')" icon="pi pi-plus" @click="openCreateForm" />
    </div>

    <pv-dialog v-model:visible="showProductForm" modal :header="$t(editingId ? 'page.products.editProduct' : 'page.products.newProduct')" :style="{ width: 'min(520px, calc(100vw - 32px))' }">
      <form class="entity-form" @submit.prevent="saveProduct">
        <label v-if="!editingId">
          {{ $t('common.name') }}
          <pv-input-text v-model.trim="productForm.name" required placeholder="Tomate orgánico" />
        </label>
        <label v-if="!editingId">
          {{ $t('common.category') }}
          <pv-select v-model="productForm.category" :options="categoryOptions" :placeholder="$t('page.products.selectCategory')" />
        </label>
        <label v-if="!editingId && productForm.category">{{ $t('common.id') }}<span class="read-only-value">{{ productsStore.nextIdForCategory(productForm.category) }}</span></label>
        <label v-if="!editingId && iamStore.isMinimarketAdmin">
          {{ $t('common.supplier') }}
          <pv-select v-model="productForm.supplierId" :options="suppliersStore.activeSuppliers" option-label="businessName" option-value="id" :placeholder="$t('page.products.selectSupplier')" />
        </label>
        <label v-if="!editingId && iamStore.isSupplier">{{ $t('common.supplier') }}<span class="read-only-value">{{ supplierName(iamStore.currentSupplierId) }}</span></label>
        <label v-if="!editingId">
          {{ $t('common.expiration') }}
          <pv-input-text v-model="productForm.expirationDate" type="date" required />
        </label>
        <div v-if="!editingId" class="form-row">
          <label>
            {{ $t('common.quantity') }}
            <pv-input-text v-model="productForm.quantity" type="number" min="0" step="1" required placeholder="40" />
          </label>
        </div>
        <label>{{ $t('common.price') }}<pv-input-text v-model="productForm.price" type="number" min="0.01" step="0.01" required placeholder="5.80" /></label>
        <label>
          {{ $t('common.description') }}
          <pv-input-text v-model.trim="productForm.description" required placeholder="Producto orgánico fresco" />
        </label>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showProductForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" :loading="productsStore.saving" @click="saveProduct" />
      </template>
    </pv-dialog>

    <pv-dialog v-model:visible="showDeleteDialog" modal :header="$t('page.products.deleteProduct')" :style="{ width: 'min(460px, calc(100vw - 32px))' }">
      <p>{{ $t('page.products.deleteConfirmation', { name: deletingProduct?.name || '' }) }}</p>
      <p v-if="deleteError" class="form-error" role="alert">{{ deleteError }}</p>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showDeleteDialog = false" />
        <pv-button :label="$t('common.delete')" icon="pi pi-trash" severity="danger" :loading="productsStore.saving" @click="deleteProduct" />
      </template>
    </pv-dialog>

    <div class="products-grid">
      <article v-for="product in filteredProducts" :key="product.id">
        <div class="card-top">
          <span>{{ product.category }}</span>
          <strong>{{ product.formattedPrice }}</strong>
        </div>
        <small class="product-id">{{ product.id }}</small>
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <p class="supplier-name">{{ $t('common.supplier') }}: {{ supplierName(product.supplierId) }}</p>
        <footer>
          <small>{{ product.quantity }} {{ $t('page.products.units') }}</small>
          <span :class="['status-badge', product.available ? 'status-approved' : 'status-rejected']">
            {{ product.available ? $t('page.products.available') : $t('page.products.unavailable') }}
          </span>
        </footer>
        <div class="card-actions">
          <pv-button :label="$t('common.edit')" icon="pi pi-pencil" size="small" outlined @click="openEditForm(product)" />
          <pv-button :label="$t('common.delete')" icon="pi pi-trash" size="small" severity="danger" text @click="confirmDelete(product)" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { useProductsStore } from '../../application/products.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useSuppliersStore } from '../../../suppliers/application/suppliers.store.js';
import { useI18n } from 'vue-i18n';

const productsStore = useProductsStore();
const iamStore = useIamStore();
const suppliersStore = useSuppliersStore();
const { t } = useI18n();
const supplierName = (id) => suppliersStore.suppliers.find((supplier) => supplier.id === id)?.businessName || id || '-';
const visibleProducts = computed(() => iamStore.isSupplier
  ? productsStore.products.filter((product) => product.supplierId === iamStore.currentSupplierId)
  : productsStore.products);
const filteredProducts = useSearchFilter(() => visibleProducts.value, [
  'id', 'name', 'category', 'description', 'price', 'quantity',
  (product) => supplierName(product.supplierId),
  (product) => t(product.available ? 'page.products.available' : 'page.products.unavailable'),
]);
const showProductForm = ref(false);
const showDeleteDialog = ref(false);
const editingId = ref(null);
const deletingProduct = ref(null);
const formError = ref('');
const deleteError = ref('');
const categoryOptions = ['Vegetales', 'Frutas', 'Lacteos', 'Organicos'];
const productForm = reactive({
  name: '',
  category: '',
  expirationDate: '',
  quantity: '',
  price: '',
  description: '',
  supplierId: null,
});

const openCreateForm = () => {
  editingId.value = null;
  Object.assign(productForm, { name: '', category: '', expirationDate: '', quantity: '', price: '', description: '', supplierId: iamStore.isSupplier ? iamStore.currentSupplierId : null });
  formError.value = '';
  showProductForm.value = true;
};
const openEditForm = (product) => {
  editingId.value = product.id;
  Object.assign(productForm, { price: String(product.price), description: product.description });
  formError.value = '';
  showProductForm.value = true;
};
const saveProduct = async () => {
  const price = Number(productForm.price);
  const description = productForm.description.trim();
  const quantity = Number(productForm.quantity);
  if (!description || !Number.isFinite(price) || price <= 0 || (!editingId.value && (
    !productForm.name.trim() || !categoryOptions.includes(productForm.category) || !suppliersStore.activeSuppliers.some((supplier) => supplier.id === productForm.supplierId) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(productForm.expirationDate) || !Number.isInteger(quantity) || quantity < 0
  ))) {
    formError.value = t('page.products.invalidForm');
    return;
  }
  formError.value = '';
  try {
    if (editingId.value) {
      await productsStore.updateProduct(editingId.value, { price, description });
    } else {
      await productsStore.createProduct({ name: productForm.name.trim(), category: productForm.category, supplierId: productForm.supplierId, expirationDate: productForm.expirationDate, quantity, price, description, available: true });
    }
    showProductForm.value = false;
  } catch {
    formError.value = t('common.errorSaving');
  }
};
const confirmDelete = (product) => {
  deletingProduct.value = product;
  deleteError.value = '';
  showDeleteDialog.value = true;
};
const deleteProduct = async () => {
  if (!deletingProduct.value) return;
  try {
    await productsStore.deleteProduct(deletingProduct.value.id);
    showDeleteDialog.value = false;
  } catch {
    deleteError.value = t('common.errorDeleting');
  }
};

onMounted(() => {
  productsStore.fetchProducts();
  suppliersStore.fetchSuppliers();
});
</script>

<style scoped>
.products-view {
  display: grid;
  gap: 18px;
}

.view-header,
.products-grid article {
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

.view-header span,
.card-top span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2,
.products-grid h3 {
  color: #021c45;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.products-grid p,
footer small {
  color: #526780;
  font-weight: 700;
}

.products-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.products-grid article {
  display: grid;
  gap: 12px;
  padding: 22px;
  align-content: start;
}

.card-top,
footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.card-top strong {
  color: #fc6910;
  font-size: 18px;
  font-weight: 950;
}
.product-id { color: #526780; font-size: 12px; font-weight: 800; }
.supplier-name { margin: 0; }
.card-actions { display: flex; gap: 8px; flex-wrap: wrap; border-top: 1px solid #d9e5f6; padding-top: 10px; }
.form-error { color: #bc2d2d; font-weight: 700; margin: 0; }
.read-only-value { background: #eff3fa; border: 1px solid #d9e5f6; border-radius: 8px; color: #023192; min-height: 42px; padding: 10px 12px; }

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
@media (max-width: 980px) {
  .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 650px) {
  .view-header { align-items: flex-start; flex-direction: column; gap: 16px; }
  .products-grid { grid-template-columns: 1fr; }
}
</style>
