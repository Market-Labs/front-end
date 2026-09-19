<template>
  <section class="communication-view">
    <div class="view-header">
      <div>
        <span>{{ $t('page.alerts.eyebrow') }}</span>
        <h2>{{ $t('page.alerts.title') }}</h2>
        <p>{{ $t('page.alerts.description') }}</p>
      </div>
      <div class="header-actions">
        <pv-button :label="$t('page.alerts.viewSuppliers')" icon="pi pi-truck" severity="secondary" @click="router.push('/suppliers')" />
        <pv-button :label="$t('page.alerts.unread', { count: communicationStore.unreadCount })" icon="pi pi-bell" />
      </div>
    </div>

    <div class="message-list">
      <article v-for="message in filteredMessages" :key="message.id" :class="{ unread: !message.read }">
        <button type="button" @click="communicationStore.toggleStarred(message.id)">
          <i :class="message.starred ? 'pi pi-star-fill' : 'pi pi-star'"></i>
        </button>
        <div>
          <strong>{{ message.subject }}</strong>
          <p>{{ message.body }}</p>
          <small>{{ message.sender }} - {{ message.sentAt }}</small>
        </div>
        <pv-button v-if="!message.read" :label="$t('page.alerts.markRead')" text @click="communicationStore.markAsRead(message.id)" />
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCommunicationStore } from '../../application/communication.store.js';
import { useSearchFilter } from '../../../shared/application/use-search-filter.js';

const communicationStore = useCommunicationStore();
const filteredMessages = useSearchFilter(() => communicationStore.messages);
const router = useRouter();

onMounted(() => {
  communicationStore.fetchMessages();
});
</script>

<style scoped>
.communication-view {
  display: grid;
  gap: 18px;
}

.view-header,
.message-list article {
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

.message-list {
  display: grid;
  gap: 12px;
}

.message-list article {
  align-items: center;
  display: flex;
  gap: 16px;
  padding: 18px;
}

.message-list article.unread {
  border-color: #fc6910;
}

.message-list button {
  background: #eff3fa;
  border: 1px solid #d9e5f6;
  border-radius: 8px;
  color: #fc6910;
  cursor: pointer;
  height: 40px;
  width: 40px;
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
}
</style>
