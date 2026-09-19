<template>
  <div class="dashboard-grid">
    <section class="metric-card hero-card">
      <div>
        <span class="eyebrow">{{ $t('page.dashboard.eyebrow') }}</span>
        <h2>{{ $t('page.dashboard.title') }}</h2>
        <p>{{ roleDescription }}</p>
      </div>
      <div class="hero-stat">
        <strong>{{ overviewStore.healthScore }}%</strong>
        <span>{{ $t('page.dashboard.health') }}</span>
      </div>
    </section>

    <button
      v-for="metric in filteredIndicators"
      :key="metric.label"
      type="button"
      class="metric-card compact"
      @click="goToMetric(metric)"
    >
      <div class="metric-icon">
        <i :class="metric.icon"></i>
      </div>
      <span>{{ metric.label }}</span>
      <strong>{{ metric.value }}</strong>
      <small>{{ metric.detail }}</small>
    </button>

    <section class="panel-card activity-card">
      <div class="section-header">
        <h2>{{ $t('page.dashboard.activity') }}</h2>
        <button type="button">{{ $t('common.view_all') }}</button>
      </div>
      <div class="timeline">
        <article v-for="event in filteredActivity" :key="event.title">
          <span :class="['status-dot', event.kind]"></span>
          <div>
            <strong>{{ event.title }}</strong>
            <p>{{ event.detail }}</p>
          </div>
          <time>{{ event.time }}</time>
        </article>
      </div>
    </section>

    <section class="panel-card modules-card">
      <div class="section-header">
        <h2>{{ $t('page.dashboard.summary') }}</h2>
      </div>
      <div class="module-list">
        <article v-for="module in filteredModules" :key="module.name">
          <i :class="module.icon"></i>
          <div>
            <strong>{{ module.name }}</strong>
            <span>{{ module.description }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDashboardOverviewStore } from '../../application/dashboard-overview.store.js';
import { useSearchFilter } from '../../application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useRequisitionStore } from '../../../requisition/application/requisition.store.js';
import { useProcurementsStore } from '../../../procurements/application/procurements.store.js';

const router = useRouter();
const { t } = useI18n();
const overviewStore = useDashboardOverviewStore();
const iamStore = useIamStore();
const requisitionStore = useRequisitionStore();
const procurementsStore = useProcurementsStore();

const adminIndicators = computed(() => [
  { label: t('dashboardRole.inventory'), value: '1,248', detail: t('dashboardRole.availableUnits'), icon: 'pi pi-box', route: '/inventory' },
  { label: t('dashboardRole.requests'), value: requisitionStore.visibleForUser(iamStore.currentUser).length, detail: t('dashboardRole.createdByMinimarket'), icon: 'pi pi-list-check', route: '/requisition' },
  { label: t('dashboardRole.shipments'), value: procurementsStore.visibleForUser(iamStore.currentUser).filter((order) => order.status === 'pending-reception').length, detail: t('dashboardRole.pendingReception'), icon: 'pi pi-truck', route: '/procurements' },
]);

const supplierIndicators = computed(() => [
  { label: t('dashboardRole.requests'), value: requisitionStore.visibleForUser(iamStore.currentUser).filter((request) => request.status === 'pending').length, detail: t('dashboardRole.toReview'), icon: 'pi pi-list-check', route: '/requisition' },
  { label: t('dashboardRole.orders'), value: procurementsStore.visibleForUser(iamStore.currentUser).length, detail: t('dashboardRole.shippingOrders'), icon: 'pi pi-truck', route: '/procurements' },
  { label: t('dashboardRole.catalog'), value: '10', detail: t('dashboardRole.organicProducts'), icon: 'pi pi-shopping-bag', route: '/products' },
]);

const roleIndicators = computed(() => (iamStore.isSupplier ? supplierIndicators.value : adminIndicators.value));

const modules = computed(() => (iamStore.isSupplier ? [
  { name: t('dashboardRole.receivedRequests'), description: t('dashboardRole.receivedRequestsDetail'), icon: 'pi pi-list-check' },
  { name: t('dashboardRole.shippingOrdersModule'), description: t('dashboardRole.shippingOrdersDetail'), icon: 'pi pi-truck' },
  { name: t('dashboardRole.supplierProfile'), description: t('dashboardRole.supplierProfileDetail'), icon: 'pi pi-id-card' },
] : [
  { name: t('dashboardRole.inventory'), description: t('dashboardRole.inventoryDetail'), icon: 'pi pi-box' },
  { name: t('dashboardRole.supplyRequests'), description: t('dashboardRole.supplyRequestsDetail'), icon: 'pi pi-list-check' },
  { name: t('dashboardRole.shipmentReception'), description: t('dashboardRole.shipmentReceptionDetail'), icon: 'pi pi-truck' },
]));

const roleDescription = computed(() => (iamStore.isSupplier
  ? t('dashboardRole.supplierDescription')
  : t('dashboardRole.adminDescription')));

const filteredIndicators = useSearchFilter(() => roleIndicators.value);
const filteredActivity = useSearchFilter(() => overviewStore.activity);
const filteredModules = useSearchFilter(() => modules.value);

const goToMetric = (metric) => {
  if (metric.route) router.push(metric.route);
};

onMounted(() => {
  overviewStore.fetchOverview();
  requisitionStore.fetchRequisitions();
  procurementsStore.fetchOrders();
});
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

.metric-card,
.panel-card {
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.hero-card {
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #eff3fa 100%);
  display: flex;
  grid-column: span 6;
  justify-content: space-between;
  min-height: 220px;
  padding: 28px;
}

.eyebrow {
  color: #0d8cfb;
  display: block;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.hero-card h2 {
  color: #021c45;
  font-size: 30px;
  line-height: 1.08;
  margin: 0;
  max-width: 390px;
}

.hero-card p {
  color: #526780;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.6;
  margin: 16px 0 0;
  max-width: 430px;
}

.hero-stat {
  align-items: center;
  background: #021c45;
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 132px;
  justify-content: center;
  min-width: 132px;
}

.hero-stat strong {
  color: #fc6910;
  font-size: 34px;
  font-weight: 950;
}

.hero-stat span {
  color: #eff3fa;
  font-size: 12px;
  font-weight: 800;
}

.metric-card.compact {
  border: 1px solid #d9e5f6;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  min-height: 220px;
  padding: 22px;
  text-align: left;
  transition: border-color 0.18s ease, transform 0.18s ease;
}

.metric-card.compact:hover {
  border-color: #0d8cfb;
  transform: translateY(-2px);
}

.metric-icon {
  align-items: center;
  background: #eff3fa;
  border-radius: 8px;
  color: #0d8cfb;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  margin-bottom: auto;
  width: 44px;
}

.metric-card.compact span {
  color: #526780;
  font-size: 13px;
  font-weight: 800;
  margin-top: 24px;
}

.metric-card.compact strong {
  color: #021c45;
  font-size: 32px;
  font-weight: 950;
  line-height: 1;
  margin-top: 10px;
}

.metric-card.compact small {
  color: #526780;
  font-size: 12px;
  font-weight: 800;
  margin-top: 8px;
}

.activity-card {
  grid-column: span 7;
  padding: 22px;
}

.modules-card {
  grid-column: span 5;
  padding: 22px;
}

.section-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
}

.section-header h2 {
  color: #021c45;
  font-size: 18px;
  font-weight: 900;
  margin: 0;
}

.section-header button {
  background: #eff3fa;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  color: #0d8cfb;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  height: 34px;
  padding: 0 12px;
}

.timeline,
.module-list {
  display: grid;
  gap: 12px;
}

.timeline article,
.module-list article {
  align-items: center;
  background: #eff3fa;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  display: flex;
  gap: 14px;
  min-height: 70px;
  padding: 14px;
}

.timeline article strong,
.module-list article strong {
  color: #021c45;
  display: block;
  font-size: 14px;
  font-weight: 900;
}

.timeline article p,
.module-list article span {
  color: #526780;
  display: block;
  font-size: 12px;
  font-weight: 700;
  margin: 4px 0 0;
}

.timeline time {
  color: #526780;
  font-size: 12px;
  font-weight: 900;
  margin-left: auto;
}

.status-dot {
  border-radius: 50%;
  flex: 0 0 12px;
  height: 12px;
  width: 12px;
}

.status-dot.warning {
  background: #fc6910;
}

.status-dot.success {
  background: #0d8cfb;
}

.status-dot.info {
  background: #0d8cfb;
}

.module-list .pi {
  align-items: center;
  background: #021c45;
  border-radius: 8px;
  color: #ffffff;
  display: inline-flex;
  height: 42px;
  justify-content: center;
  width: 42px;
}

@media (max-width: 1100px) {
  .hero-card,
  .metric-card.compact,
  .activity-card,
  .modules-card {
    grid-column: span 12;
  }
}
</style>
