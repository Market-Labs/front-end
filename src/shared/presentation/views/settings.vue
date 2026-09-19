<template>
  <section class="settings-view">
    <div class="settings-header">
      <div>
        <span>{{ $t('page.settings.eyebrow') }}</span>
        <h2>{{ $t('page.settings.title') }}</h2>
        <p>{{ $t('page.settings.description') }}</p>
      </div>
      <pv-button :label="$t('page.settings.saveChanges')" icon="pi pi-save" @click="saveSettings()" />
    </div>

    <div class="settings-grid">
      <article>
        <i class="pi pi-language"></i>
        <div>
          <strong>{{ $t('page.settings.language') }}</strong>
          <p>{{ localeLabel }}</p>
        </div>
      </article>
      <article>
        <i class="pi pi-moon"></i>
        <div>
          <strong>{{ $t('page.settings.theme') }}</strong>
          <p>{{ $t('page.settings.lightTheme') }}</p>
        </div>
      </article>
      <article>
        <i class="pi pi-bell"></i>
        <div>
          <strong>{{ $t('page.settings.notifications') }}</strong>
          <p>{{ $t('page.settings.notificationsDetail') }}</p>
        </div>
      </article>
      <article>
        <i class="pi pi-shield"></i>
        <div>
          <strong>{{ $t('page.settings.session') }}</strong>
          <p>{{ $t('page.settings.sessionDetail') }}</p>
        </div>
      </article>
    </div>

    <p v-if="savedMessage" class="saved-message">{{ savedMessage }}</p>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const savedMessage = ref('');
const { locale, t } = useI18n();
const localeLabel = computed(() => (locale.value === 'es' ? 'ES - Espanol' : 'EN - English'));

const saveSettings = () => {
  savedMessage.value = t('page.settings.saved');
};
</script>

<style scoped>
.settings-view {
  display: grid;
  gap: 18px;
}

.settings-header,
.settings-grid article,
.saved-message {
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.settings-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px;
}

.settings-header span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.settings-header h2 {
  color: #021c45;
  font-size: 26px;
  font-weight: 950;
  margin: 6px 0;
}

.settings-header p,
.settings-grid p {
  color: #526780;
  font-weight: 700;
  margin: 0;
}

.settings-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.settings-grid article {
  align-items: center;
  display: flex;
  gap: 16px;
  padding: 22px;
}

.settings-grid i {
  align-items: center;
  background: #021c45;
  border-radius: 8px;
  color: #ffffff;
  display: inline-flex;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.settings-grid strong {
  color: #021c45;
  display: block;
  font-weight: 950;
  margin-bottom: 4px;
}

.saved-message {
  color: #023192;
  font-weight: 900;
  padding: 16px 20px;
}
</style>
