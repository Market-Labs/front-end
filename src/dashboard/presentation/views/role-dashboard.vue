<template>
  <section class="dashboard-view">
    <div class="view-header">
      <div>
        <span>Dashboard</span>
        <h2>Indicadores por rol</h2>
        <p>Vista operativa para inventario, requisiciones, abastecimiento, alertas y actividad.</p>
      </div>
      <pv-button label="Refrescar" icon="pi pi-refresh" @click="dashboardStore.fetchIndicators()" />
    </div>

    <div class="indicator-grid">
      <article v-for="indicator in dashboardStore.indicators" :key="indicator.type">
        <span>{{ indicator.title }}</span>
        <strong>{{ indicator.value }}</strong>
        <small :class="indicator.variation >= 0 ? 'up' : 'down'">
          {{ indicator.variation >= 0 ? '+' : '' }}{{ indicator.variation }}% vs periodo anterior
        </small>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '../../application/dashboard.store.js';

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchIndicators();
});
</script>

<style scoped>
.dashboard-view {
  display: grid;
  gap: 18px;
}

.view-header,
.indicator-grid article {
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
  text-transform: uppercase;
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

.indicator-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.indicator-grid article {
  display: grid;
  gap: 10px;
  min-height: 150px;
  padding: 22px;
}

.indicator-grid span {
  color: #66756b;
  font-size: 13px;
  font-weight: 850;
}

.indicator-grid strong {
  color: #16251d;
  font-size: 34px;
  font-weight: 950;
}

.indicator-grid small {
  font-size: 12px;
  font-weight: 900;
}

.indicator-grid small.up {
  color: #247b5d;
}

.indicator-grid small.down {
  color: #b42318;
}
</style>
