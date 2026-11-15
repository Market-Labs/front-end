<template>
  <section class="conservation-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.conservation.eyebrow') }}</span>
        <h2>{{ $t('page.conservation.title') }}</h2>
        <p>{{ $t('page.conservation.description') }}</p>
      </div>
      <pv-button :label="$t('page.conservation.viewAlerts')" icon="pi pi-bell" @click="router.push('/communication')" />
    </div>

    <div class="table-card">
      <pv-data-table :value="filteredRecords" class="marketgo-datatable" responsive-layout="scroll">
        <pv-column field="zone" :header="$t('page.conservation.zone')" />
        <pv-column field="productName" :header="$t('common.product')" />
        <pv-column field="temperature" :header="$t('page.conservation.temperature')" />
        <pv-column field="humidity" :header="$t('page.conservation.humidity')" />
        <pv-column :header="$t('page.conservation.record')">
          <template #body="{ data }">
            <span>{{ formatDateTime(data.recordedAt, locale) }}</span>
            <small class="record-age">{{ ageLabel(data.recordedAt) }}</small>
          </template>
        </pv-column>
        <pv-column :header="$t('common.status')">
          <template #body="{ data }">
            <span :class="['status-badge', isMonitoringStale(data.recordedAt, now) ? 'status-stale' : data.isRisky ? 'status-risk' : 'status-healthy']" :title="isMonitoringStale(data.recordedAt, now) ? $t('page.conservation.staleHelp') : undefined">
              {{ isMonitoringStale(data.recordedAt, now) ? $t('page.conservation.stale') : $t(`status.${data.status}`) }}
            </span>
          </template>
        </pv-column>
      </pv-data-table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConservationStore } from '../../application/conservation.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';
import { formatAge, formatDateTime, isMonitoringStale } from '../../../shared/domain/model/date-time.js';

const router = useRouter();
const conservationStore = useConservationStore();
const iamStore = useIamStore();
const { locale, t } = useI18n();
const now = ref(new Date());
const ageLabel = (value) => {
  const age = formatAge(value, now.value, locale.value);
  return age ? t('page.conservation.lastUpdated', { age }) : t('page.conservation.unknownDate');
};
const filteredRecords = useSearchFilter(() => conservationStore.records);

let clock;
onMounted(() => {
  conservationStore.fetchMonitoring(iamStore.isSupplier);
  clock = setInterval(() => { now.value = new Date(); }, 60000);
});
onUnmounted(() => clearInterval(clock));
</script>

<style scoped>
.conservation-view {
  display: grid;
  gap: 18px;
}

.view-header,
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
  text-transform: uppercase;
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

.record-age { display: block; color: #526780; margin-top: 3px; }
.status-stale { background: #e7edf4; color: #34495e; }
</style>
