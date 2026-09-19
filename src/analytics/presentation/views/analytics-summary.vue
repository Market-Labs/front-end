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

    <section v-if="selectedReportSummary" class="report-detail">
      <div>
        <span>Reporte seleccionado</span>
        <h3>{{ selectedReportSummary.title }}</h3>
        <p>{{ selectedReportSummary.description }}</p>
      </div>

      <div class="report-metrics">
        <article v-for="metric in selectedReportSummary.metrics" :key="metric.label">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
        </article>
      </div>

      <ul>
        <li v-for="highlight in selectedReportSummary.highlights" :key="highlight">
          <i class="pi pi-check-circle"></i>
          {{ highlight }}
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAnalyticsStore } from '../../application/analytics.store.js';

const analyticsStore = useAnalyticsStore();
const selectedReport = ref('Inventario');
const generatedReport = ref('');

const reportButtonLabel = computed(() => `Generar ${selectedReport.value}`);
const selectedReportSummary = computed(() => analyticsStore.reportSummaries[selectedReport.value]);

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
.reports-card,
.report-detail,
.report-metrics article {
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
  text-transform: uppercase;
}

.view-header h2,
.reports-card h3,
.report-detail h3 {
  color: #021c45;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.report-detail p {
  color: #526780;
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
  color: #526780;
  font-weight: 850;
}

.analytics-grid strong {
  color: #021c45;
  font-size: 30px;
  font-weight: 950;
}

.up {
  color: #023192;
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
  background: #eff3fa;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  min-height: 42px;
  padding: 0 14px;
}

.reports-card button.active {
  background: #021c45;
  color: #ffffff;
}

.report-feedback {
  color: #023192;
  font-size: 13px;
  font-weight: 900;
  margin: 16px 0 0;
}

.report-detail {
  display: grid;
  gap: 18px;
  padding: 22px;
}

.report-detail > div:first-child span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.report-metrics {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.report-metrics article {
  box-shadow: none;
  display: grid;
  gap: 8px;
  padding: 16px;
}

.report-metrics span {
  color: #526780;
  font-size: 13px;
  font-weight: 850;
}

.report-metrics strong {
  color: #021c45;
  font-size: 24px;
  font-weight: 950;
}

.report-detail ul {
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.report-detail li {
  align-items: center;
  color: #023192;
  display: flex;
  font-weight: 750;
  gap: 8px;
}

.report-detail li i {
  color: #0d8cfb;
}
</style>
