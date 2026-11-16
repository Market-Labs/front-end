<template>
  <main class="auth-page">
    <language-switcher class="auth-language" />
    <section class="auth-panel" aria-labelledby="recovery-title">
      <div class="auth-brand">
        <img src="/logo-marketgo.png" alt="" />
        <h1>MarketGo</h1>
        <p>{{ t('app.tagline') }}</p>
      </div>
      <div class="auth-intro">
        <h2 id="recovery-title">{{ t('auth.forgotPassword') }}</h2>
        <p>{{ t('auth.recoveryDescription') }}</p>
      </div>
      <p class="auth-notice" role="status">{{ t('auth.recoveryUnavailable') }}</p>
      <router-link class="auth-back" to="/login"><i class="pi pi-arrow-left"></i>{{ t('auth.backToLogin') }}</router-link>
    </section>
  </main>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from '../../../shared/presentation/components/language-switcher.vue';

const { t } = useI18n();
</script>

<style src="./auth.css"></style>
