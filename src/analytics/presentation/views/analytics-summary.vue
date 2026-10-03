<template>
  <section class="analytics-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.analytics.eyebrow') }}</span>
        <h2>{{ $t('page.analytics.title') }}</h2>
        <p>{{ iamStore.isSupplier ? $t('page.analytics.supplierDescription') : $t('page.analytics.description') }}</p>
      </div>
      <div class="analytics-mark" aria-hidden="true"><i class="pi pi-chart-bar"></i></div>
    </div>

    <div class="analytics-grid">
      <article v-for="indicator in filteredIndicators" :key="indicator.label">
        <span>{{ indicator.label }}</span>
        <strong>{{ indicator.value }}</strong>
      </article>
    </div>

    <div class="reports-card" :aria-busy="generating">
      <h3>{{ $t('page.analytics.availableReports') }}</h3>
      <div>
        <button
          v-for="report in visibleReports"
          :key="report"
          type="button"
          :class="{ active: selectedReport === report }"
          :disabled="generating"
          @click="generateReport(report)"
        >
          <i class="pi pi-chart-line"></i>
          {{ $t(`page.analytics.reportNames.${report}`) }}
        </button>
      </div>
      <p v-if="error" class="report-error" role="alert">{{ error }}</p>
    </div>

    <section v-if="generatedReport" class="report-detail">
      <div class="report-toolbar">
        <div><span>{{ $t('page.analytics.selectedReport') }}</span><h3>{{ generatedReport.title }}</h3><p>{{ generatedReport.rows.length }} {{ $t('page.analytics.records') }} · {{ displayDate(generatedReport.generatedAt) }}</p></div>
        <div class="export-actions">
          <pv-button :label="$t('page.analytics.exportPdf')" icon="pi pi-file-pdf" outlined :loading="exporting" @click="exportPdf" />
          <pv-button :label="$t('page.analytics.exportXlsx')" icon="pi pi-file-excel" outlined :loading="exporting" @click="exportXlsx" />
        </div>
      </div>
      <div ref="reportElement" class="report-print">
        <div class="report-print-heading"><strong>MarketGo · {{ generatedReport.title }}</strong><span>{{ displayDate(generatedReport.generatedAt) }}</span></div>
        <div class="report-table-scroll"><table class="report-table"><thead><tr><th v-for="column in generatedReport.columns" :key="column.key">{{ column.label }}</th></tr></thead><tbody><tr v-for="(row, index) in generatedReport.rows" :key="index"><td v-for="column in generatedReport.columns" :key="column.key">{{ column.kind === 'money' ? money(row[column.key]) : row[column.key] }}</td></tr></tbody></table></div>
        <p v-if="!generatedReport.rows.length" class="empty-report">{{ $t('page.analytics.noRows') }}</p>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAnalyticsStore } from '../../application/analytics.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { buildReport } from '../../application/report-builder.js';
import { exportReportPdf, exportReportXlsx } from '../../infrastructure/report-exporter.js';

const analyticsStore = useAnalyticsStore();
const iamStore = useIamStore();
const { t, locale } = useI18n();
const selectedReport = ref(null);
const generatedReport = ref(null);
const generating = ref(false);
const exporting = ref(false);
const error = ref('');
const reportElement = ref(null);
const reportTypes = ['Inventario', 'Abastecimiento', 'Mermas', 'Conservacion', 'Proveedores', 'Ventas'];
const filteredReports = useSearchFilter(() => reportTypes.map((key) => ({ key, label: t(`page.analytics.reportNames.${key}`) })));
const visibleReports = computed(() => filteredReports.value.map((item) => item.key));
const money = (value) => `S/ ${Number(value || 0).toFixed(2)}`;
const displayDate = (value) => new Date(value).toLocaleString(locale.value === 'es' ? 'es-PE' : 'en-US');
const filteredIndicators = useSearchFilter(() => {
  const sources = analyticsStore.reportSources;
  if (!sources) return [];
  const ownerId = iamStore.isSupplier ? iamStore.currentSupplierId : iamStore.currentMinimarketId;
  const orders = sources.orders.filter((order) => iamStore.isSupplier ? order.supplierId === ownerId : order.minimarketId === ownerId);
  const stock = sources.inventory.reduce((sum, item) => sum + Number(item.stock || 0), 0);
  const waste = sources.waste.filter((item) => item.ownerId === ownerId).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const sales = iamStore.isSupplier ? orders.filter((order) => order.status === 'received').length : sources.sales.filter((sale) => sale.minimarketId === ownerId).length;
  const normal = sources.conservation.filter((item) => item.status === 'healthy').length;
  const score = sources.conservation.length ? Math.round(normal / sources.conservation.length * 100) : 0;
  return [
    { label: t('page.analytics.inventoryTotal'), value: `${stock} ${t('page.inventory.units')}` },
    { label: t('page.analytics.wasteTotal'), value: `${waste} ${t('page.inventory.units')}` },
    { label: t('page.analytics.salesTotal'), value: `${sales}` },
    { label: t('page.analytics.conservationScore'), value: `${score}%` },
  ];
});

const generateReport = async (type) => {
  selectedReport.value = type;
  generating.value = true;
  error.value = '';
  generatedReport.value = null;
  try {
    await analyticsStore.fetchReportSources(iamStore.isSupplier);
    if (!analyticsStore.reportSources) throw new Error('missing-report-data');
    generatedReport.value = buildReport(type, analyticsStore.reportSources, iamStore.isSupplier, t);
  } catch { error.value = t('page.analytics.reportError'); }
  finally { generating.value = false; }
};

const exportFile = async (action) => {
  exporting.value = true;
  error.value = '';
  try { await action(); } catch { error.value = t('page.analytics.exportError'); }
  finally { exporting.value = false; }
};
const exportPdf = () => exportFile(() => exportReportPdf(generatedReport.value, reportElement.value));
const exportXlsx = () => exportFile(() => exportReportXlsx(generatedReport.value));

onMounted(() => analyticsStore.fetchReportSources(iamStore.isSupplier));
watch(locale, () => {
  if (generatedReport.value && analyticsStore.reportSources) {
    const generatedAt = generatedReport.value.generatedAt;
    generatedReport.value = { ...buildReport(generatedReport.value.type, analyticsStore.reportSources, iamStore.isSupplier, t), generatedAt };
  }
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
.report-table {
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

.analytics-mark {
  align-items: center;
  background: #eff3fa;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  color: #0d8cfb;
  display: flex;
  flex: 0 0 56px;
  font-size: 24px;
  height: 56px;
  justify-content: center;
  margin-left: 16px;
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

.reports-card button:disabled { cursor: wait; }

.report-error {
  color: #b42318;
  font-size: 13px;
  font-weight: 900;
  margin: 16px 0 0;
}

.report-detail {
  display: grid;
  gap: 18px;
  padding: 22px;
}

.report-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.report-toolbar span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.export-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.report-print { background: #fff; }
.report-print-heading { display: flex; justify-content: space-between; color: #021c45; padding: 8px 0 16px; }
.report-table-scroll { overflow-x: auto; }
.report-table { width: 100%; border-collapse: collapse; box-shadow: none; font-size: 12px; white-space: nowrap; }
.report-table th { color: #fff; background: #023192; text-align: left; }
.report-table td, .report-table th { border-bottom: 1px solid #d9e5f6; padding: 9px 12px; }
.report-table tbody tr:nth-child(even) { background: #eff3fa; }
.empty-report { color: #526780; padding: 18px 0; }
</style>
