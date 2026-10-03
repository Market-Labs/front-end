<template>
  <main class="auth-page">
    <section class="auth-panel" aria-labelledby="login-title">
      <div class="auth-brand">
        <img src="/logo-marketgo.png" alt="" />
        <h1 id="login-title">MarketGo</h1>
        <p>{{ t('app.tagline') }}</p>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <label for="login-email">{{ t('auth.email') }}</label>
        <input id="login-email" v-model.trim="email" type="email" autocomplete="username" required placeholder="usuario@marketgo.com" />

        <div class="auth-label-row">
          <label for="login-password">{{ t('auth.password') }}</label>
          <router-link to="/forgot-password">{{ t('auth.forgotPassword') }}</router-link>
        </div>
        <div class="password-field">
          <input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required />
          <button type="button" :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        <label class="remember-option">
          <input v-model="remember" type="checkbox" />
          {{ t('auth.remember') }}
        </label>
        <p v-if="error" class="auth-error" role="alert">{{ error }}</p>
        <button class="auth-submit" type="submit" :disabled="submitting">
          {{ submitting ? t('auth.signingIn') : t('auth.signIn') }}
        </button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../application/iam.store.js';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const iamStore = useIamStore();
const email = ref('');
const password = ref('');
const remember = ref(false);
const showPassword = ref(false);
const submitting = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';
  submitting.value = true;
  try {
    await iamStore.signIn(email.value, password.value, remember.value);
    const redirect = route.query.redirect;
    await router.replace(typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/home');
  } catch (cause) {
    error.value = cause.message === 'invalid-credentials' ? t('auth.invalidCredentials') : t('auth.connectionError');
  } finally {
    submitting.value = false;
  }
};
</script>

<style src="./auth.css"></style>
