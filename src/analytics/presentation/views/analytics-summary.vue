<template>
  <section class="analytics-view">
    <div class="view-header">
      <div>
        <span>Analytics</span>
        <h2>Indicadores y reportes operativos</h2>
        <p>Resumen agregado para inventario, mermas, ventas, conservacion y abastecimiento.</p>
      </div>
      <pv-button :label="reportButtonLabel" icon="pi pi-file-pdf" @click="generateReport()" />
    </div>

    <div class="analytics-grid">
      <article v-for="indicator in analyticsStore.indicators" :key="indicator.label">
        <span>{{ indicator.label }}</span>
        <strong>{{ indicator.currentValue }}{{ indicator.unit }}</strong>
        <small :class="indicator.variation >= 0 ? 'up' : 'down'">
          {{ indicator.variation >= 0 ? '+' : '' }}{{ indicator.variation }}%
        </small>
      </article>
    </div>

    <div class="reports-card">
      <h3>Reportes disponibles</h3>
      <div>
        <button
          v-for="report in analyticsStore.reports"
          :key="report"
          type="button"
          :class="{ active: selectedReport === report }"
          @click="selectedReport = report"
        >
          <i class="pi pi-chart-line"></i>
          {{ report }}
        </button>
      </div>
      <p v-if="generatedReport" class="report-feedback">{{ generatedReport }}</p>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAnalyticsStore } from '../../application/analytics.store.js';

const analyticsStore = useAnalyticsStore();
const selectedReport = ref('Inventario');
const generatedReport = ref('');

const reportButtonLabel = computed(() => `Generar ${selectedReport.value}`);

const generateReport = () => {
  generatedReport.value = `Reporte de ${selectedReport.value} generado para revision.`;
};

onMounted(() => {
  analyticsStore.fetchSummary();
});
</script>

<style scoped>
.analytics-view {
  display: grid;
  gap: 18px;
}

.view-header,
.analytics-grid article,
.reports-card {
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

.view-header h2,
.reports-card h3 {
  color: #16251d;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p {
  color: #66756b;
  font-weight: 700;
  margin: 0;
}

.analytics-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.analytics-grid article {
  display: grid;
  gap: 10px;
  padding: 22px;
}

.analytics-grid span,
.reports-card button {
  color: #66756b;
  font-weight: 850;
}

.analytics-grid strong {
  color: #16251d;
  font-size: 30px;
  font-weight: 950;
}

.up {
  color: #247b5d;
}

.down {
  color: #b42318;
}

.reports-card {
  padding: 22px;
}

.reports-card div {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.reports-card button {
  align-items: center;
  background: #f9fbf8;
  border: 1px solid #e8ede9;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
}

.reports-card button.active {
  background: #10261c;
  color: #ffffff;
}

.report-feedback {
  color: #247b5d;
  font-size: 13px;
  font-weight: 900;
  margin: 16px 0 0;
}
</style>
