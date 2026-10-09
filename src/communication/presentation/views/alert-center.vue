  <section class="communication-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.alerts.eyebrow') }}</span>
        <h2>{{ $t('page.alerts.title') }}</h2>
        <p>{{ $t('page.alerts.description') }}</p>
      </div>
      <div class="header-actions">
        <pv-button :label="iamStore.isSupplier ? $t('option.clients') : $t('page.alerts.viewSuppliers')" icon="pi pi-users" severity="secondary" @click="router.push(iamStore.isSupplier ? '/clients' : '/suppliers')" />
        <pv-button :label="$t('page.alerts.unread', { count: communicationStore.unreadCount })" icon="pi pi-bell" />
      </div>
    </div>

    <div class="message-list">
      <article v-for="message in filteredMessages" :key="message.id" :class="{ unread: !message.read }">
        <button type="button" class="star-button" @click="communicationStore.toggleStarred(message.id)">
          <i :class="message.starred ? 'pi pi-star-fill' : 'pi pi-star'"></i>
        </button>
        <div>
          <strong>{{ message.subject }}</strong>
          <p>{{ message.body }}</p>
          <small>{{ message.sender }} - {{ message.sentAt }}</small>
        </div>
        <pv-button v-if="!message.read" class="read-action" :label="$t('page.alerts.markRead')" text @click="communicationStore.markAsRead(message.id)" />
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useCommunicationStore } from '../../application/communication.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';
import { useIamStore } from '../../../iam/application/iam.store.js';

const communicationStore = useCommunicationStore();
const iamStore = useIamStore();
const filteredMessages = useSearchFilter(() => communicationStore.messages);
const router = useRouter();
const { locale } = useI18n();

onMounted(() => {
  communicationStore.fetchMessages(iamStore.isSupplier);
});
watch(locale, () => communicationStore.fetchMessages(iamStore.isSupplier));
</script>

<style scoped>
@@ -57,7 +45,7 @@ watch(locale, () => communicationStore.fetchMessages(iamStore.isSupplier));
.view-header,
.message-list article {
  background: #ffffff;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}
@@ -69,28 +57,22 @@ watch(locale, () => communicationStore.fetchMessages(iamStore.isSupplier));
  padding: 24px;
}

.header-actions {
  align-items: center;
  display: flex;
  gap: 10px;
}

.view-header span {
  color: #0d8cfb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2 {
  color: #021c45;
  font-size: 26px;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p {
  color: #526780;
  font-weight: 700;
  margin: 0;
}
@@ -108,47 +90,27 @@ watch(locale, () => communicationStore.fetchMessages(iamStore.isSupplier));
}

.message-list article.unread {
  border-color: #fc6910;
}

.message-list button {
  background: #f9fbf8;
  border: 1px solid #e8ede9;
  border-radius: 8px;
  color: #fc6910;
  cursor: pointer;
  height: 40px;
  width: 40px;
  flex: 0 0 40px;
}

.message-list article > div {
  flex: 1;
  min-width: 0;
}

.message-list .read-action {
  flex: 0 0 auto;
  white-space: nowrap;
}

@media (max-width: 600px) {
  .message-list article {
    flex-wrap: wrap;
  }
  .message-list .read-action {
    margin-left: 56px;
  }
}

.message-list strong {
  color: #021c45;
  font-weight: 950;
}

.message-list p,
.message-list small {
  color: #526780;
  display: block;
  font-weight: 700;
  margin: 4px 0 0;
