<template>
  <section class="iam-view">
    <div class="view-header">
      <div>
        <span>IAM</span>
        <h2>Usuarios, roles y permisos</h2>
        <p>Control de acceso para administradores de minimarket y proveedores organicos.</p>
      </div>
      <pv-button label="Nuevo usuario" icon="pi pi-user-plus" @click="iamStore.addDemoUser()" />
    </div>

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
import { computed, onMounted } from 'vue';
import { useIamStore } from '../../application/iam.store.js';

const iamStore = useIamStore();

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
</style>
