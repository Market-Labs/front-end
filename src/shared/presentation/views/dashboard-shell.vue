<template>
  <div class="dashboard-grid">
    <section class="metric-card hero-card">
      <div>
        <span class="eyebrow">{{ $t('page.dashboard.eyebrow') }}</span>
        <h2>{{ $t('page.dashboard.title') }}</h2>
        <p>{{ roleDescription }}</p>
      </div>
      <div class="hero-stat">
        <strong>{{ stockSummary.totalLots ? `${stockSummary.freshRate}%` : '--' }}</strong>
        <span>{{ $t('page.dashboard.health') }}</span>
        <small>{{ $t('page.dashboard.healthFormula') }}</small>
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
      <small v-if="metric.note" class="stock-warning">{{ metric.note }}</small>
    </button>

    <section class="panel-card activity-card">
      <div class="section-header">
        <h2>{{ $t('page.dashboard.activity') }}</h2>
        <button type="button" @click="router.push('/communication')">{{ $t('common.view_all') }}</button>
      </div>
      <div class="timeline">
        <article v-for="event in filteredActivity" :key="`${event.title}-${event.detail}`">
          <span :class="['status-dot', event.kind]"></span>
          <div>
            <strong>{{ event.title }}</strong>
            <p>{{ event.detail }}</p>
          </div>
          <time :datetime="event.time">{{ formatDateTime(event.time, locale) }}</time>
        </article>
        <p v-if="!filteredActivity.length" class="empty-activity">{{ $t('page.dashboard.noRecentActivity') }}</p>
      </div>
    </section>

    <section class="panel-card modules-card">
      <div class="section-header">
        <h2>{{ $t('page.dashboard.summary') }}</h2>
      </div>
      <div class="module-list">
        <button
          v-for="module in filteredModules"
          :key="module.name"
          type="button"
          class="module-action"
          @click="goToMetric(module)"
        >
          <i :class="module.icon"></i>
          <div>
            <strong>{{ module.name }}</strong>
            <span>{{ module.description }}</span>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useDashboardOverviewStore } from '../../application/dashboard-overview.store.js';
import { useSearchFilter } from '../../application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { useRequisitionStore } from '../../../requisition/application/requisition.store.js';
import { useProcurementsStore } from '../../../procurements/application/procurements.store.js';
import { useInventoryStore } from '../../../inventory/application/inventory.store.js';
import { useProductsStore } from '../../../products/application/products.store.js';
import { daysUntilExpiration } from '../../../inventory/domain/model/expiration-policy.js';
import { formatDateTime, parseDateTime } from '../../domain/model/date-time.js';

const router = useRouter();
const { t, locale } = useI18n();
const overviewStore = useDashboardOverviewStore();
const iamStore = useIamStore();
const requisitionStore = useRequisitionStore();
const procurementsStore = useProcurementsStore();
const inventoryStore = useInventoryStore();
const productsStore = useProductsStore();
const now = ref(new Date());

const stockSummary = computed(() => {
  const lots = inventoryStore.items.filter((item) => Number(item.stock) > 0);
  const withDays = lots.map((item) => ({ item, days: daysUntilExpiration(item.expirationDate, now.value) }));
  const usable = withDays.filter(({ days }) => days !== null && days >= 0);
  const expired = withDays.filter(({ days }) => days !== null && days < 0);
  const near = usable.filter(({ days }) => days <= 5);
  return {
    usableUnits: usable.reduce((sum, { item }) => sum + Number(item.stock), 0),
    expiredUnits: expired.reduce((sum, { item }) => sum + Number(item.stock), 0),
    expiredLots: expired.length,
    nearLots: near.length,
    totalLots: lots.length,
    freshRate: lots.length ? Math.round(usable.length / lots.length * 100) : 0,
    expiring: [...expired, ...near].sort((a, b) => a.days - b.days),
  };
});

const adminIndicators = computed(() => [
  { label: t('dashboardRole.inventory'), value: stockSummary.value.usableUnits, detail: t('dashboardRole.availableUnits'), note: t('dashboardRole.stockWarnings', { expired: stockSummary.value.expiredUnits, lots: stockSummary.value.expiredLots, near: stockSummary.value.nearLots }), icon: 'pi pi-box', route: '/inventory' },
  { label: t('dashboardRole.requests'), value: requisitionStore.visibleForUser(iamStore.currentUser).length, detail: t('dashboardRole.createdByMinimarket'), icon: 'pi pi-list-check', route: '/requisition' },
  { label: t('dashboardRole.shipments'), value: procurementsStore.visibleForUser(iamStore.currentUser).filter((order) => order.status === 'pending-reception').length, detail: t('dashboardRole.pendingReception'), icon: 'pi pi-truck', route: '/procurements' },
]);

const supplierIndicators = computed(() => [
  { label: t('dashboardRole.requests'), value: requisitionStore.visibleForUser(iamStore.currentUser).filter((request) => request.status === 'pending').length, detail: t('dashboardRole.toReview'), icon: 'pi pi-list-check', route: '/requisition' },
  { label: t('dashboardRole.orders'), value: procurementsStore.visibleForUser(iamStore.currentUser).length, detail: t('dashboardRole.shippingOrders'), icon: 'pi pi-truck', route: '/procurements' },
  { label: t('dashboardRole.catalog'), value: productsStore.products.filter((product) => product.supplierId === iamStore.currentSupplierId).length, detail: t('dashboardRole.organicProducts'), icon: 'pi pi-shopping-bag', route: '/products' },
]);

const roleIndicators = computed(() => (iamStore.isSupplier ? supplierIndicators.value : adminIndicators.value));

const modules = computed(() => (iamStore.isSupplier ? [
  { name: t('dashboardRole.receivedRequests'), description: t('dashboardRole.receivedRequestsDetail'), icon: 'pi pi-list-check', route: '/requisition' },
  { name: t('dashboardRole.shippingOrdersModule'), description: t('dashboardRole.shippingOrdersDetail'), icon: 'pi pi-truck', route: '/procurements' },
  { name: t('option.clients'), description: t('page.clients.description'), icon: 'pi pi-users', route: '/clients' },
] : [
  { name: t('dashboardRole.inventory'), description: t('dashboardRole.inventoryDetail'), icon: 'pi pi-box', route: '/inventory' },
  { name: t('dashboardRole.supplyRequests'), description: t('dashboardRole.supplyRequestsDetail'), icon: 'pi pi-list-check', route: '/requisition' },
  { name: t('dashboardRole.shipmentReception'), description: t('dashboardRole.shipmentReceptionDetail'), icon: 'pi pi-truck', route: '/procurements' },
]));

const roleDescription = computed(() => (iamStore.isSupplier
  ? t('dashboardRole.supplierDescription')
  : t('dashboardRole.adminDescription')));

const filteredIndicators = useSearchFilter(() => roleIndicators.value);
const activity = computed(() => {
  const current = stockSummary.value.expiring.slice(0, 3).map(({ item, days }) => ({
    title: t(days < 0 ? 'page.dashboard.expiredLot' : 'page.dashboard.expiringLot'),
    detail: t(days < 0 ? 'page.alerts.expiredBody' : 'page.alerts.expiringBody', {
      product: item.productName, lot: item.lotCode, days,
    }),
    kind: 'warning', time: now.value.toISOString(),
  }));
  const dated = overviewStore.activity.filter((event) => {
    const timestamp = event.createdAt || event.time;
    if (typeof timestamp !== 'string' || !/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(timestamp)) return false;
    const date = parseDateTime(timestamp);
    const age = date && now.value.getTime() - date.getTime();
    return age !== null && age >= 0 && age <= 7 * 24 * 60 * 60 * 1000;
  });
  return [...current, ...dated.map((event) => ({ ...event, time: event.createdAt || event.time }))].slice(0, 5);
});
const filteredActivity = useSearchFilter(() => activity.value);
const filteredModules = useSearchFilter(() => modules.value);

const goToMetric = (metric) => {
  if (metric.route) router.push(metric.route);
};

let clock;
onMounted(() => {
  clock = setInterval(() => { now.value = new Date(); }, 60000);
  overviewStore.fetchOverview(iamStore.isSupplier);
  requisitionStore.fetchRequisitions();
  procurementsStore.fetchOrders();
  inventoryStore.fetchInventory(iamStore.isSupplier);
  productsStore.fetchProducts();
});
onUnmounted(() => clearInterval(clock));
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

.hero-stat small { color: #eff3fa; font-size: 10px; line-height: 1.25; max-width: 120px; text-align: center; margin-top: 5px; }
.metric-card.compact .stock-warning { color: #a94719; line-height: 1.3; }
.empty-activity { color: #526780; font-size: 13px; margin: 0; }

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
.module-action {
  align-items: center;
  background: #eff3fa;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  color: inherit;
  cursor: pointer;
  display: flex;
  gap: 14px;
  min-height: 70px;
  padding: 14px;
  text-align: left;
  width: 100%;
}

.module-action {
  transition: border-color 0.18s ease, transform 0.18s ease;
}

.module-action:hover {
  border-color: #0d8cfb;
  transform: translateY(-1px);
}

.timeline article strong,
.module-action strong {
  color: #021c45;
  display: block;
  font-size: 14px;
  font-weight: 900;
}

.timeline article p,
.module-action span {
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
