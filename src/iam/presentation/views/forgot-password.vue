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
      <form class="auth-form" @submit.prevent="submit">
        <label for="recovery-email">{{ t('auth.email') }}</label>
        <input id="recovery-email" v-model.trim="email" type="email" autocomplete="email" required placeholder="usuario@marketgo.com" />
        <button class="auth-submit" type="submit" :disabled="submitting">{{ t('auth.requestReset') }}</button>
        <p v-if="submitted" class="auth-notice" role="status">{{ t(isFirebaseMode ? 'auth.recoverySent' : 'auth.recoveryDemo') }}</p>
        <p v-if="error" class="auth-error" role="alert">{{ t('auth.connectionError') }}</p>
      </form>
      <router-link class="auth-back" to="/login"><i class="pi pi-arrow-left"></i>{{ t('auth.backToLogin') }}</router-link>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth, isFirebaseMode } from '../../../shared/infrastructure/firebase-client.js';

const { t } = useI18n();
const email = ref('');
const submitted = ref(false);
const submitting = ref(false);
const error = ref(false);

const submit = async () => {
  submitted.value = false;
  error.value = false;
  if (!isFirebaseMode) {
    submitted.value = true;
    return;
  }
  submitting.value = true;
  try {
    await sendPasswordResetEmail(firebaseAuth, email.value.trim().toLowerCase());
    submitted.value = true;
  } catch {
    error.value = true;
  } finally {
    submitting.value = false;
  }
};
</script>

<style src="./auth.css"></style>
