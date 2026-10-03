<template>
  <main class="auth-page">
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
      <form class="auth-form" @submit.prevent="submitted = true">
        <label for="recovery-email">{{ t('auth.email') }}</label>
        <input id="recovery-email" v-model.trim="email" type="email" autocomplete="email" required placeholder="usuario@marketgo.com" />
        <button class="auth-submit" type="submit">{{ t('auth.requestReset') }}</button>
        <p v-if="submitted" class="auth-notice" role="status">{{ t('auth.recoveryDemo') }}</p>
      </form>
      <router-link class="auth-back" to="/login"><i class="pi pi-arrow-left"></i>{{ t('auth.backToLogin') }}</router-link>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const email = ref('');
const submitted = ref(false);
</script>

<style src="./auth.css"></style>
