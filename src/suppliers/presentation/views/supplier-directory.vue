<template>
  <section class="suppliers-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.suppliers.eyebrow') }}</span>
        <h2>{{ $t('page.suppliers.title') }}</h2>
        <p>{{ $t('page.suppliers.description') }}</p>
      </div>
      <pv-button :label="$t('page.suppliers.newSupplier')" icon="pi pi-plus" @click="openSupplierForm" />
    </div>

    <pv-dialog v-model:visible="showSupplierForm" modal :header="$t(editingId ? 'page.suppliers.editSupplier' : 'page.suppliers.newSupplier')" :style="{ width: 'min(540px, calc(100vw - 32px))' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('page.suppliers.businessName') }}
          <pv-input-text v-model="supplierForm.businessName" placeholder="Anita Gamboa" />
        </label>
        <div class="form-row">
          <label>
            RUC
            <pv-input-text v-model="supplierForm.ruc" placeholder="10456789012" />
          </label>
          <label>
            {{ $t('page.suppliers.phone') }}
            <pv-input-text v-model="supplierForm.phone" placeholder="+51 959 404 210" />
          </label>
        </div>
        <label>
          {{ $t('page.suppliers.email') }}
          <pv-input-text v-model="supplierForm.email" placeholder="anitaG@bioandes.pe" />
        </label>
        <label>
          {{ $t('page.suppliers.address') }}
          <pv-input-text v-model="supplierForm.address" placeholder="Cerro Colorado, Arequipa" />
        </label>
        <div class="form-row">
          <label>
            {{ $t('page.suppliers.specialty') }}
            <pv-input-text v-model="supplierForm.specialty" placeholder="Lácteos y derivados" />
          </label>
          <label>
            {{ $t('page.suppliers.coverage') }}
            <pv-input-text v-model="supplierForm.coverageArea" placeholder="Cerro Colorado - Arequipa" />
          </label>
        </div>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showSupplierForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" :loading="saving" @click="saveSupplier" />
      </template>
    </pv-dialog>

    <pv-dialog v-model:visible="showDeleteDialog" modal :header="$t('page.suppliers.deleteSupplier')" :style="{ width: 'min(460px, calc(100vw - 32px))' }">
      <p>{{ $t('page.suppliers.deleteConfirmation', { name: deletingSupplier?.businessName || '' }) }}</p>
      <p v-if="deleteError" class="form-error" role="alert">{{ deleteError }}</p>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showDeleteDialog = false" />
        <pv-button :label="$t('common.delete')" icon="pi pi-trash" severity="danger" :loading="saving" @click="deactivateSupplier" />
      </template>
    </pv-dialog>

    <div class="supplier-grid">
      <article v-for="supplier in filteredSuppliers" :key="supplier.id">
        <span>{{ supplier.ruc }}</span>
        <h3>{{ supplier.businessName }}</h3>
        <p>{{ supplier.specialty }}</p>
        <footer>
          <small>{{ supplier.coverageArea }}</small>
          <strong>{{ supplier.phone }}</strong>
        </footer>
        <div class="supplier-actions">
          <pv-button :label="$t('common.edit')" icon="pi pi-pencil" size="small" outlined @click="openEditForm(supplier)" />
          <pv-button :label="$t('common.delete')" icon="pi pi-trash" size="small" severity="danger" text @click="confirmDelete(supplier)" />
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useSuppliersStore } from '../../application/suppliers.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useI18n } from 'vue-i18n';

const suppliersStore = useSuppliersStore();
const { t } = useI18n();
const filteredSuppliers = useSearchFilter(() => suppliersStore.activeSuppliers);
const showSupplierForm = ref(false);
const showDeleteDialog = ref(false);
const editingId = ref(null);
const deletingSupplier = ref(null);
const saving = ref(false);
const formError = ref('');
const deleteError = ref('');
const supplierForm = reactive({
  businessName: '',
  ruc: '',
  email: '',
  phone: '',
  address: '',
  specialty: '',
  coverageArea: '',
});

const openSupplierForm = () => {
  editingId.value = null;
  Object.keys(supplierForm).forEach((key) => { supplierForm[key] = ''; });
  formError.value = '';
  showSupplierForm.value = true;
};
const openEditForm = (supplier) => {
  editingId.value = supplier.id;
  Object.keys(supplierForm).forEach((key) => { supplierForm[key] = supplier[key] || ''; });
  formError.value = '';
  showSupplierForm.value = true;
};
const confirmDelete = (supplier) => {
  deletingSupplier.value = supplier;
  deleteError.value = '';
  showDeleteDialog.value = true;
};
const deactivateSupplier = async () => {
  if (!deletingSupplier.value) return;
  saving.value = true;
  deleteError.value = '';
  try {
    await suppliersStore.deactivateSupplier(deletingSupplier.value.id);
    showDeleteDialog.value = false;
    deletingSupplier.value = null;
  } catch {
    deleteError.value = t('common.errorDeleting');
  } finally {
    saving.value = false;
  }
};
const saveSupplier = async () => {
  const data = Object.fromEntries(Object.entries(supplierForm).map(([key, value]) => [key, value.trim()]));
  if (Object.values(data).some((value) => !value) || !/^\S+@\S+\.\S+$/.test(data.email) || !/^\d{11}$/.test(data.ruc)) {
    formError.value = t('common.invalidForm');
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    if (editingId.value) await suppliersStore.updateSupplier(editingId.value, data);
    else await suppliersStore.createSupplier(data);
    showSupplierForm.value = false;
    editingId.value = null;
  } catch {
    formError.value = t('common.errorSaving');
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  suppliersStore.fetchSuppliers();
});
</script>

<style scoped>
.suppliers-view {
  display: grid;
  gap: 18px;
}

.view-header,
.supplier-grid article {
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
.supplier-grid span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2,
.supplier-grid h3 {
  color: #021c45;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.supplier-grid p,
footer small {
  color: #526780;
  font-weight: 700;
}

.supplier-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.supplier-grid article {
  padding: 22px;
}

.supplier-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

footer {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-top: 18px;
}

footer strong {
  color: #fc6910;
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
