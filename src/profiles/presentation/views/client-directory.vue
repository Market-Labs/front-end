<template>
  <section class="clients-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.clients.eyebrow') }}</span>
        <h2>{{ $t('page.clients.title') }}</h2>
        <p>{{ $t('page.clients.description') }}</p>
      </div>
      <pv-button :label="$t('page.clients.newClient')" icon="pi pi-plus" @click="openCreateForm" />
    </div>

    <pv-dialog v-model:visible="showForm" modal :header="$t(editingId ? 'page.clients.editClient' : 'page.clients.newClient')" :style="{ width: 'min(540px, calc(100vw - 32px))' }">
      <form class="client-form" @submit.prevent="saveClient">
        <label>{{ $t('page.suppliers.businessName') }}<pv-input-text v-model.trim="clientForm.businessName" required /></label>
        <label>{{ $t('page.suppliers.email') }}<pv-input-text v-model.trim="clientForm.email" type="email" required /></label>
        <label>{{ $t('page.suppliers.phone') }}<pv-input-text v-model.trim="clientForm.phone" required /></label>
        <label>{{ $t('page.suppliers.address') }}<pv-input-text v-model.trim="clientForm.address" required /></label>
        <label>{{ $t('page.profiles.zone') }}<pv-input-text v-model.trim="clientForm.district" required /></label>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
        <div class="form-actions">
          <pv-button :label="$t('common.cancel')" text type="button" @click="showForm = false" />
          <pv-button :label="$t('common.save')" icon="pi pi-save" type="submit" :loading="saving" />
        </div>
      </form>
    </pv-dialog>

    <p v-if="clientsStore.error" class="load-error" role="alert">{{ $t('page.clients.loadError') }}</p>
    <p v-else-if="!clientsStore.loading && !clientsStore.clients.length" class="empty-state">{{ $t('page.clients.empty') }}</p>
    <div class="clients-grid">
      <article v-for="client in filteredClients" :key="client.id">
        <h3>{{ client.businessName }}</h3>
        <p>{{ client.address }}</p>
        <dl>
          <div><dt>{{ $t('page.suppliers.email') }}</dt><dd>{{ client.email }}</dd></div>
          <div><dt>{{ $t('page.profiles.phone') }}</dt><dd>{{ client.phone }}</dd></div>
          <div><dt>{{ $t('page.profiles.zone') }}</dt><dd>{{ client.district }}</dd></div>
        </dl>
        <pv-button :label="$t('common.edit')" icon="pi pi-pencil" size="small" outlined @click="openEditForm(client)" />
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { useClientsStore } from '../../application/clients.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useI18n } from 'vue-i18n';

const clientsStore = useClientsStore();
const filteredClients = useSearchFilter(() => clientsStore.clients);
const { t } = useI18n();
const showForm = ref(false);
const editingId = ref(null);
const saving = ref(false);
const formError = ref('');
const clientForm = reactive({ businessName: '', email: '', phone: '', address: '', district: '' });

const openCreateForm = () => {
  editingId.value = null;
  Object.keys(clientForm).forEach((key) => { clientForm[key] = ''; });
  formError.value = '';
  showForm.value = true;
};
const openEditForm = (client) => {
  editingId.value = client.id;
  Object.keys(clientForm).forEach((key) => { clientForm[key] = client[key] || ''; });
  formError.value = '';
  showForm.value = true;
};
const saveClient = async () => {
  if (saving.value) return;
  const payload = Object.fromEntries(Object.entries(clientForm).map(([key, value]) => [key, value.trim()]));
  if (Object.values(payload).some((value) => !value) || !/^\S+@\S+\.\S+$/.test(payload.email)) {
    formError.value = t('common.invalidForm');
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    if (editingId.value) await clientsStore.updateClient(editingId.value, payload);
    else await clientsStore.createClient(payload);
    showForm.value = false;
  } catch {
    formError.value = t('page.clients.saveError');
  } finally {
    saving.value = false;
  }
};
onMounted(() => clientsStore.fetchClients());
</script>

<style scoped>
.clients-view { display: grid; gap: 18px; }
.view-header, .clients-grid article, .empty-state, .load-error { background: #fff; border: 1px solid #d9e5f6; border-radius: 8px; box-shadow: 0 12px 26px rgba(15, 23, 42, .05); padding: 24px; }
.view-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.view-header span { color: #0d8cfb; font-size: 12px; font-weight: 900; text-transform: uppercase; }
.view-header h2, .clients-grid h3 { color: #021c45; margin: 6px 0; }
.view-header p, .clients-grid p, dd { color: #526780; margin: 0; }
.clients-grid { display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
dl { display: grid; gap: 12px; margin: 20px 0; }
dt { color: #526780; font-size: 12px; font-weight: 900; }
dd { margin: 4px 0 0; }
.client-form { display: grid; gap: 14px; }
.client-form label { color: #023192; display: grid; font-size: 13px; font-weight: 800; gap: 6px; }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; }
.form-error, .load-error { color: #b42318; }
@media (max-width: 700px) { .clients-grid { grid-template-columns: 1fr; } .view-header { align-items: flex-start; flex-direction: column; } }
</style>