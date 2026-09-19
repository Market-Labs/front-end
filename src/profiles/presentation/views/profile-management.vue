<template>
  <section class="profiles-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.profiles.eyebrow') }}</span>
        <h2>{{ $t('page.profiles.title') }}</h2>
        <p>{{ $t('page.profiles.description') }}</p>
      </div>
      <pv-button :label="$t('page.profiles.updateProfile')" icon="pi pi-pencil" />
    </div>

    <div class="profiles-grid">
      <article v-for="profile in filteredProfiles" :key="profile.id">
        <div class="profile-type">{{ profile.type }}</div>
        <h3>{{ profile.businessName }}</h3>
        <p>{{ profile.address }}</p>
        <dl>
          <div>
            <dt>{{ $t('page.profiles.phone') }}</dt>
            <dd>{{ profile.phone }}</dd>
          </div>
          <div>
            <dt>{{ $t('page.profiles.zone') }}</dt>
            <dd>{{ profile.displayArea }}</dd>
          </div>
          <div v-if="profile.specialty">
            <dt>{{ $t('page.profiles.specialty') }}</dt>
            <dd>{{ profile.specialty }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useProfilesStore } from '../../application/profiles.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const profilesStore = useProfilesStore();
const filteredProfiles = useSearchFilter(() => profilesStore.profiles);

onMounted(() => {
  profilesStore.fetchProfiles();
});
</script>

<style scoped>
.profiles-view {
  display: grid;
  gap: 18px;
}

.view-header,
.profiles-grid article {
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

.view-header span,
.profile-type {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2,
.profiles-grid h3 {
  color: #021c45;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p,
.profiles-grid p,
dd {
  color: #526780;
  font-weight: 700;
}

.profiles-grid {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.profiles-grid article {
  padding: 24px;
}

dl {
  display: grid;
  gap: 12px;
  margin: 20px 0 0;
}

dt {
  color: #526780;
  font-size: 12px;
  font-weight: 900;
}

dd {
  margin: 4px 0 0;
}
</style>
