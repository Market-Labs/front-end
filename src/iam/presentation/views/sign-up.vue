<template>
  <main class="auth-page">
    <language-switcher class="auth-language" />
    <section class="auth-panel signup-panel" aria-labelledby="signup-title">
      <div class="auth-brand">
        <img src="/logo-marketgo.png" alt="" />
        <h1>MarketGo</h1>
        <p>{{ t('app.tagline') }}</p>
      </div>
      <div class="auth-intro">
        <h2 id="signup-title">{{ t('auth.createAccount') }}</h2>
        <p>{{ t('auth.signupDescription') }}</p>
      </div>
      <form class="auth-form" @submit.prevent="submit">
        <div class="signup-types" role="group" :aria-label="t('auth.accountType')">
          <button type="button" :class="{ selected: type === 'admin' }" :aria-pressed="type === 'admin'" @click="type = 'admin'">
            <i class="pi pi-building"></i>{{ t('auth.minimarket') }}
          </button>
          <button type="button" :class="{ selected: type === 'supplier' }" :aria-pressed="type === 'supplier'" @click="type = 'supplier'">
            <i class="pi pi-truck"></i>{{ t('auth.supplier') }}
          </button>
        </div>

        <label for="signup-name">{{ t('auth.fullName') }}</label>
        <input id="signup-name" v-model.trim="name" type="text" autocomplete="name" required maxlength="120" />

        <label for="signup-email">{{ t('auth.email') }}</label>
        <input id="signup-email" v-model.trim="email" type="email" autocomplete="email" required placeholder="you@example.com" />

        <label for="signup-business">{{ t(type === 'admin' ? 'auth.minimarketName' : 'auth.supplierName') }}</label>
        <input id="signup-business" v-model.trim="businessName" type="text" autocomplete="organization" required maxlength="120" />

        <label for="signup-password">{{ t('auth.password') }}</label>
        <div class="password-field">
          <input id="signup-password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" required minlength="6" />
          <button type="button" :aria-label="showPassword ? t('auth.hidePassword') : t('auth.showPassword')" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
          </button>
        </div>

        <label class="remember-option"><input v-model="acceptedTerms" type="checkbox" required />{{ t('auth.acceptTerms') }}</label>
        <button class="auth-terms-link" type="button" @click="showTerms = !showTerms">{{ t('auth.readTerms') }}</button>
        <p v-if="showTerms" class="auth-notice">{{ t('auth.termsText') }}</p>
        <p v-if="error" class="auth-error" role="alert">{{ error }}</p>
        <button class="auth-submit" type="submit" :disabled="submitting || !isFirebaseMode">
          {{ submitting ? t('auth.creatingAccount') : t('auth.createAccount') }}
        </button>
        <p v-if="!isFirebaseMode" class="auth-notice">{{ t('auth.signupFirebaseOnly') }}</p>
      </form>
      <p class="auth-footer">{{ t('auth.alreadyAccount') }} <router-link to="/login">{{ t('auth.signIn') }}</router-link></p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useIamStore } from '../../application/iam.store.js';
import { isFirebaseMode } from '../../../shared/infrastructure/firebase-client.js';
import LanguageSwitcher from '../../../shared/presentation/components/language-switcher.vue';

const { t } = useI18n();
const router = useRouter();
const iamStore = useIamStore();
const type = ref('admin');
const name = ref('');
const email = ref('');
const businessName = ref('');
const password = ref('');
const showPassword = ref(false);
const acceptedTerms = ref(false);
const showTerms = ref(false);
const submitting = ref(false);
const error = ref('');

const submit = async () => {
  error.value = '';
  if (!acceptedTerms.value || !name.value || !businessName.value || password.value.length < 6) {
    error.value = t('common.invalidForm');
    return;
  }
  submitting.value = true;
  try {
    await iamStore.signUp({ type: type.value, name: name.value, email: email.value, businessName: businessName.value, password: password.value });
    await router.replace('/home');
  } catch (cause) {
    error.value = cause.code === 'auth/email-already-in-use' ? t('auth.emailInUse')
      : cause.code === 'auth/weak-password' ? t('auth.weakPassword')
        : cause.message === 'signup-cleanup-required' ? t('auth.cleanupRequired') : t('auth.signupError');
  } finally {
    submitting.value = false;
  }
};
</script>

<style src="./auth.css"></style>
