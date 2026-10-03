<template>
  <section class="iam-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.iam.eyebrow') }}</span>
        <h2>{{ $t('page.iam.title') }}</h2>
        <p>{{ $t('page.iam.description') }}</p>
      </div>
      <pv-button :label="$t('page.iam.newUser')" icon="pi pi-user-plus" @click="openUserForm" />
    </div>

    <pv-dialog v-model:visible="showUserForm" modal :header="$t('page.iam.newUser')" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          {{ $t('page.iam.user') }}
          <pv-select v-model="userForm.userId" :options="visibleUsers" option-label="name" option-value="id" :placeholder="$t('page.iam.selectUser')" />
        </label>
        <label>
          {{ $t('page.iam.email') }}
          <span class="read-only-value">{{ selectedUser?.email || '-' }}</span>
        </label>
        <div class="form-row">
          <label>
            {{ $t('page.iam.role') }}
            <pv-select v-model="userForm.role" :options="roleOptions" :placeholder="$t('page.iam.selectRole')" />
          </label>
          <label>
            {{ $t('common.status') }}
            <pv-select v-model="userForm.status" :options="statusOptions" option-label="label" option-value="value" :placeholder="$t('page.iam.selectStatus')" />
          </label>
        </div>
        <p v-if="formError" class="form-error" role="alert">{{ formError }}</p>
      </form>
      <template #footer>
        <pv-button :label="$t('common.cancel')" text @click="showUserForm = false" />
        <pv-button :label="$t('common.save')" icon="pi pi-save" :loading="saving" @click="saveUser" />
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
            <span class="status-badge status-approved">{{ $t(`status.${data.status}`) }}</span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, onMounted, watch } from 'vue';
import { useIamStore } from '../../application/iam.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useI18n } from 'vue-i18n';

const iamStore = useIamStore();
const { t } = useI18n();
const visibleUsers = computed(() => iamStore.isSupplier
  ? iamStore.users.filter((user) => user.id === iamStore.currentUser?.id)
  : iamStore.users);
const filteredUsers = useSearchFilter(() => visibleUsers.value);
const showUserForm = ref(false);
const saving = ref(false);
const formError = ref('');
const roleOptions = computed(() => [...new Set(visibleUsers.value.flatMap((user) => user.roles))]);
const statusOptions = computed(() => [
  { label: t('status.active'), value: 'active' },
  { label: t('status.inactive'), value: 'inactive' },
]);
const userForm = reactive({
  userId: null,
  role: null,
  status: 'active',
});
const selectedUser = computed(() => visibleUsers.value.find((user) => user.id === userForm.userId));

watch(selectedUser, (user) => {
  userForm.role = user?.roles?.[0] || null;
  userForm.status = user?.status || 'active';
});

const openUserForm = () => {
  userForm.userId = null;
  userForm.role = null;
  userForm.status = 'active';
  formError.value = '';
  showUserForm.value = true;
};

const saveUser = async () => {
  if (!selectedUser.value || !roleOptions.value.includes(userForm.role) || !['active', 'inactive'].includes(userForm.status)) {
    formError.value = t('common.invalidForm');
    return;
  }
  saving.value = true;
  formError.value = '';
  try {
    const matchingRole = iamStore.users.find((user) => user.roles.includes(userForm.role));
    await iamStore.updateUser(selectedUser.value.id, { roles: [userForm.role], status: userForm.status, permissions: matchingRole?.permissions || [] });
    showUserForm.value = false;
  } catch {
    formError.value = t('common.errorSaving');
  } finally {
    saving.value = false;
  }
};

const summaryCards = computed(() => [
  { label: 'page.iam.activeUsers', value: visibleUsers.value.filter((user) => user.status === 'active').length, icon: 'pi pi-users' },
  { label: 'page.iam.definedRoles', value: roleOptions.value.length, icon: 'pi pi-id-card' },
  { label: 'page.iam.keyPermissions', value: new Set(visibleUsers.value.flatMap((user) => user.permissions)).size, icon: 'pi pi-shield' },
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
</style>
