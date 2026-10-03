<template>
  <section class="profiles-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.profiles.eyebrow') }}</span>
        <h2>{{ $t('page.profiles.title') }}</h2>
        <p>{{ $t('page.profiles.description') }}</p>
      </div>
      <pv-button :label="$t('page.profiles.updateProfile')" icon="pi pi-pencil" @click="openContactForm" />
    </div>

    <pv-dialog v-model:visible="showContactForm" modal :header="$t('page.profiles.updateProfile')" :style="{ width: '520px' }">
      <form class="contact-form" @submit.prevent="saveContact">
        <label>{{ $t('common.name') }}<pv-input-text v-model.trim="contactForm.businessName" required /></label>
        <label>{{ $t('page.suppliers.email') }}<pv-input-text v-model.trim="contactForm.email" type="email" required /></label>
        <label>{{ $t('page.profiles.phone') }}<pv-input-text v-model.trim="contactForm.phone" required /></label>
        <label>{{ $t('page.suppliers.address') }}<pv-input-text v-model.trim="contactForm.address" required /></label>
        <label>{{ $t('page.profiles.zone') }}<pv-input-text v-model.trim="contactForm.area" /></label>
        <label v-if="iamStore.isSupplier">{{ $t('page.profiles.specialty') }}<pv-input-text v-model.trim="contactForm.specialty" /></label>
        <p v-if="feedback" role="status">{{ feedback }}</p>
        <div class="contact-actions">
          <pv-button :label="$t('common.cancel')" text type="button" @click="showContactForm = false" />
          <pv-button :label="$t('common.save')" icon="pi pi-save" type="submit" :loading="saving" />
        </div>
      </form>
    </pv-dialog>

    <div class="profiles-grid">
      <article v-for="profile in filteredProfiles" :key="profile.id">
        <div class="profile-type">{{ profile.type }}</div>
        <h3>{{ profile.businessName }}</h3>
        <p>{{ profile.address }}</p>
        <dl>
          <div v-if="profile.email">
            <dt>{{ $t('page.suppliers.email') }}</dt>
            <dd>{{ profile.email }}</dd>
          </div>
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
import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useProfilesStore } from '../../application/profiles.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';

const profilesStore = useProfilesStore();
const iamStore = useIamStore();
const { t } = useI18n();
const ownProfile = computed(() => profilesStore.profiles.find((profile) => profile.userId === iamStore.currentUser?.id));
const filteredProfiles = useSearchFilter(() => ownProfile.value ? [ownProfile.value] : []);
const showContactForm = ref(false);
const saving = ref(false);
const feedback = ref('');
const contactForm = reactive({ businessName: '', email: '', phone: '', address: '', area: '', specialty: '' });

const openContactForm = () => {
  if (!ownProfile.value) return;
  const profile = ownProfile.value;
  Object.assign(contactForm, {
    businessName: profile.businessName,
    email: profile.email || '',
    phone: profile.phone,
    address: profile.address,
    area: profile.displayArea,
    specialty: profile.specialty || '',
  });
  feedback.value = '';
  showContactForm.value = true;
};

const saveContact = async () => {
  if (!ownProfile.value || saving.value) return;
  saving.value = true;
  try {
    await profilesStore.updateContact(ownProfile.value.id, {
      businessName: contactForm.businessName,
      email: contactForm.email,
      phone: contactForm.phone,
      address: contactForm.address,
      [iamStore.isSupplier ? 'coverageArea' : 'district']: contactForm.area,
      ...(iamStore.isSupplier ? { specialty: contactForm.specialty } : {}),
    });
    showContactForm.value = false;
  } catch (error) {
    feedback.value = t('page.profiles.saveError');
  } finally {
    saving.value = false;
  }
};

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

.contact-form { display: grid; gap: 14px; }
.contact-form label { color: #023192; display: grid; font-size: 13px; font-weight: 800; gap: 6px; }
.contact-actions { display: flex; justify-content: flex-end; gap: 8px; }
.contact-form p { color: #b42318; margin: 0; }
@media (max-width: 700px) { .profiles-grid { grid-template-columns: 1fr; } }
</style>
