<template>
  <section class="clients-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.clients.eyebrow') }}</span>
        <h2>{{ $t('page.clients.title') }}</h2>
        <p>{{ $t('page.clients.description') }}</p>
      </div>
    </div>
    <div class="clients-grid">
      <article v-for="client in filteredClients" :key="client.id">
        <h3>{{ client.businessName }}</h3>
        <p>{{ client.address }}</p>
        <dl>
          <div><dt>{{ $t('page.profiles.phone') }}</dt><dd>{{ client.phone }}</dd></div>
          <div><dt>{{ $t('page.profiles.zone') }}</dt><dd>{{ client.displayArea }}</dd></div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useProfilesStore } from '../../application/profiles.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const profilesStore = useProfilesStore();
const clients = computed(() => profilesStore.profiles.filter((profile) => profile.type === 'minimarket'));
const filteredClients = useSearchFilter(() => clients.value);

onMounted(() => profilesStore.fetchProfiles());
</script>

<style scoped>
.clients-view { display: grid; gap: 18px; }
.view-header, .clients-grid article { background: #fff; border: 1px solid #d9e5f6; border-radius: 8px; box-shadow: 0 12px 26px rgba(15, 23, 42, .05); padding: 24px; }
.view-header span { color: #0d8cfb; font-size: 12px; font-weight: 900; text-transform: uppercase; }
.view-header h2, .clients-grid h3 { color: #021c45; margin: 6px 0; }
.view-header p, .clients-grid p, dd { color: #526780; margin: 0; }
.clients-grid { display: grid; gap: 18px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
dl { display: grid; gap: 12px; margin: 20px 0 0; }
dt { color: #526780; font-size: 12px; font-weight: 900; }
dd { margin: 4px 0 0; }
@media (max-width: 700px) { .clients-grid { grid-template-columns: 1fr; } }
</style>
