<template>
  <section class="iam-view">
    <div class="view-header">
      <div>
        <span>IAM</span>
        <h2>Usuarios, roles y permisos</h2>
        <p>Control de acceso para administradores de minimarket y proveedores organicos.</p>
      </div>
      <pv-button label="Nuevo usuario" icon="pi pi-user-plus" @click="showUserForm = true" />
    </div>

    <pv-dialog v-model:visible="showUserForm" modal header="Nuevo usuario" :style="{ width: '520px' }">
      <form class="entity-form" @submit.prevent>
        <label>
          Nombre
          <pv-input-text v-model="userForm.name" placeholder="Albino Caceres" />
        </label>
        <label>
          Correo
          <pv-input-text v-model="userForm.email" placeholder="usuario@marketgo.pe" />
        </label>
        <div class="form-row">
          <label>
            Rol
            <pv-select v-model="userForm.role" :options="roleOptions" placeholder="Seleccionar rol" />
          </label>
          <label>
            Estado
            <pv-select v-model="userForm.status" :options="statusOptions" placeholder="Seleccionar estado" />
          </label>
        </div>
      </form>
      <template #footer>
        <pv-button label="Cancelar" text @click="showUserForm = false" />
        <pv-button label="Guardar" icon="pi pi-save" @click="noopSubmit" />
      </template>
    </pv-dialog>

    <div class="summary-grid">
      <article v-for="card in summaryCards" :key="card.label">
        <i :class="card.icon"></i>
        <span>{{ card.label }}</span>
        <strong>{{ card.value }}</strong>
      </article>
    </div>

    <div class="table-card">
      <pv-data-table :value="iamStore.users" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="name" header="Usuario" />
        <pv-column field="email" header="Correo" />
        <pv-column header="Rol">
          <template #body="{ data }">
            {{ data.roles[0] }}
          </template>
        </pv-column>
        <pv-column header="Estado">
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

const iamStore = useIamStore();
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
  { label: 'Usuarios activos', value: iamStore.users.length, icon: 'pi pi-users' },
  { label: 'Roles definidos', value: 2, icon: 'pi pi-id-card' },
  { label: 'Permisos clave', value: 5, icon: 'pi pi-shield' },
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
  border: 1px solid #e8ede9;
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
  color: #3d9f7d;
  font-size: 12px;
  font-weight: 900;
}

.view-header h2 {
  color: #16251d;
  font-size: 26px;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p {
  color: #66756b;
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
  color: #f08a24;
  font-size: 22px;
}

.summary-grid span {
  color: #66756b;
  font-size: 13px;
  font-weight: 800;
}

.summary-grid strong {
  color: #16251d;
  font-size: 30px;
  font-weight: 950;
}

.entity-form {
  display: grid;
  gap: 14px;
}

.entity-form label {
  color: #33423a;
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
