<template>
  <section class="iam-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.iam.eyebrow') }}</span>
        <h2>{{ $t('page.iam.title') }}</h2>
        <p>{{ $t('page.iam.description') }}</p>
      </div>
      <pv-button :label="$t('page.iam.newUser')" icon="pi pi-user-plus" @click="showUserForm = true" />
    </div>

    <pv-dialog v-model:visible="showUserForm" modal :header="$t('page.iam.newUser')" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('common.name') }}
          <pv-input-text v-model="userForm.name" placeholder="Albino Caceres" />
        </label>
        <label>
          {{ $t('page.iam.email') }}
          <pv-input-text v-model="userForm.email" placeholder="usuario@marketgo.pe" />
        </label>
        <div class="form-row">
          <label>
            {{ $t('page.iam.role') }}
            <pv-select v-model="userForm.role" :options="roleOptions" :placeholder="$t('page.iam.selectRole')" />
          </label>
          <label>
            {{ $t('common.status') }}
            <pv-select v-model="userForm.status" :options="statusOptions" :placeholder="$t('page.iam.selectStatus')" />
          </label>
        </div>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showUserForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

    <div class="summary-grid">
      <article v-for="card in summaryCards" :key="card.label">
        <i :class="card.icon"></i>
        <span>{{ $t(card.label) }}</span>
        <strong>{{ card.value }}</strong>
      </article>
    </div>

    <div class="table-card">
      <pv-data-table :value="filteredUsers" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="name" :header="$t('page.iam.user')" />
        <pv-column field="email" :header="$t('page.iam.email')" />
        <pv-column :header="$t('page.iam.role')">
          <template #body="{ data }">
            {{ data.roles[0] }}
          </template>
        </pv-column>
        <pv-column :header="$t('common.status')">
          <template #body="{ data }">
            <span class="status-badge status-approved">{{ data.status }}</span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import { useIamStore } from '../../application/iam.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const iamStore = useIamStore();
const filteredUsers = useSearchFilter(() => iamStore.users);
const showUserForm = ref(false);
const roleOptions = ['Administrador de Minimarket', 'Proveedor Organico', 'Operador de Minimarket'];
const statusOptions = ['active', 'inactive'];
const userForm = reactive({
  name: '',
  email: '',
  role: '',
  status: 'active',
});

const noopSubmit = () => {};

const summaryCards = computed(() => [
  { label: 'page.iam.activeUsers', value: iamStore.users.length, icon: 'pi pi-users' },
  { label: 'page.iam.definedRoles', value: 2, icon: 'pi pi-id-card' },
  { label: 'page.iam.keyPermissions', value: 5, icon: 'pi pi-shield' },
]);

onMounted(() => {
  iamStore.fetchUsers();
});
</script>

<style scoped>
.iam-view {
  display: grid;
  gap: 18px;
}

.view-header,
.summary-grid article,
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

.summary-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.summary-grid article {
  display: grid;
  gap: 10px;
  padding: 20px;
}

.summary-grid i {
  color: #fc6910;
  font-size: 22px;
}

.summary-grid span {
  color: #526780;
  font-size: 13px;
  font-weight: 800;
}

.summary-grid strong {
  color: #021c45;
  font-size: 30px;
  font-weight: 950;
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
</style>
