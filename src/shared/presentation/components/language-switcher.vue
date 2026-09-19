<template>
  <div class="language-switcher" aria-label="Language selector">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :class="{ active: locale === option.value }"
      @click="setLocale(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const options = [
  { label: 'ES', value: 'es' },
  { label: 'EN', value: 'en' },
];

const setLocale = (value) => {
  locale.value = value;
};
</script>

<style scoped>
.language-switcher {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: #eef2f7;
  border-radius: 8px;
}

.language-switcher button {
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #526780;
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  height: 30px;
  min-width: 34px;
}

.language-switcher button.active {
  background: #ffffff;
  color: #023192;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}
</style>
