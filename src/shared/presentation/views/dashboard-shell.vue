<template>
  <div class="dashboard-grid">
    <section class="metric-card hero-card">
      <div>
        <span class="eyebrow">MarketGo overview</span>
        <h2>Control operativo de productos organicos</h2>
        <p>
          Base visual preparada para conectar inventario, abastecimiento,
          alertas de conservacion y actividad por rol.
        </p>
      </div>
      <div class="hero-stat">
        <strong>{{ overviewStore.healthScore }}%</strong>
        <span>salud operacional</span>
      </div>
    </section>

    <button
      v-for="metric in overviewStore.indicators"
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
        <h2>Actividad reciente</h2>
        <button type="button">{{ $t('common.view_all') }}</button>
      </div>
      <div class="timeline">
        <article v-for="event in overviewStore.activity" :key="event.title">
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
        <h2>Resumen operativo</h2>
      </div>
      <div class="module-list">
        <article v-for="module in modules" :key="module.name">
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
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDashboardOverviewStore } from '../../application/dashboard-overview.store.js';

const router = useRouter();
const overviewStore = useDashboardOverviewStore();

const modules = [
  { name: 'Productos organicos', description: 'Catalogo actualizado con stock y disponibilidad.', icon: 'pi pi-shopping-bag' },
  { name: 'Conservacion', description: 'Temperatura y humedad monitoreadas por zona.', icon: 'pi pi-cloud' },
  { name: 'Abastecimiento', description: 'Ordenes de compra listas para seguimiento.', icon: 'pi pi-truck' },
];

const goToMetric = (metric) => {
  if (metric.route) router.push(metric.route);
};

onMounted(() => {
  overviewStore.fetchOverview();
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
  border: 1px solid #e8ede9;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.hero-card {
  align-items: center;
  background: linear-gradient(135deg, #ffffff 0%, #eef8f0 100%);
  display: flex;
  grid-column: span 6;
  justify-content: space-between;
  min-height: 220px;
  padding: 28px;
}

.eyebrow {
  color: #3d9f7d;
  display: block;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.hero-card h2 {
  color: #16251d;
  font-size: 30px;
  line-height: 1.08;
  margin: 0;
  max-width: 390px;
}

.hero-card p {
  color: #66756b;
  font-size: 14px;
  font-weight: 650;
  line-height: 1.6;
  margin: 16px 0 0;
  max-width: 430px;
}

.hero-stat {
  align-items: center;
  background: #10261c;
  border-radius: 8px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 132px;
  justify-content: center;
  min-width: 132px;
}

.hero-stat strong {
  color: #f08a24;
  font-size: 34px;
  font-weight: 950;
}

.hero-stat span {
  color: #c8d3cd;
  font-size: 12px;
  font-weight: 800;
}

.metric-card.compact {
  border: 1px solid #e8ede9;
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
  border-color: #3d9f7d;
  transform: translateY(-2px);
}

.metric-icon {
  align-items: center;
  background: #f5f7f4;
  border-radius: 8px;
  color: #3d9f7d;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  margin-bottom: auto;
  width: 44px;
}

.metric-card.compact span {
  color: #78877f;
  font-size: 13px;
  font-weight: 800;
  margin-top: 24px;
}

.metric-card.compact strong {
  color: #16251d;
  font-size: 32px;
  font-weight: 950;
  line-height: 1;
  margin-top: 10px;
}

.metric-card.compact small {
  color: #91a099;
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
  color: #16251d;
  font-size: 18px;
  font-weight: 900;
  margin: 0;
}

.section-header button {
  background: #f5f7f4;
  border: 1px solid #e3e8e4;
  border-radius: 8px;
  color: #3d9f7d;
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
  background: #f9fbf8;
  border: 1px solid #edf1ee;
  border-radius: 8px;
  display: flex;
  gap: 14px;
  min-height: 70px;
  padding: 14px;
}

.timeline article strong,
.module-list article strong {
  color: #26362c;
  display: block;
  font-size: 14px;
  font-weight: 900;
}

.timeline article p,
.module-list article span {
  color: #75847b;
  display: block;
  font-size: 12px;
  font-weight: 700;
  margin: 4px 0 0;
}

.timeline time {
  color: #92a099;
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
  background: #f08a24;
}

.status-dot.success {
  background: #3d9f7d;
}

.status-dot.info {
  background: #4f80c7;
}

.module-list .pi {
  align-items: center;
  background: #10261c;
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
