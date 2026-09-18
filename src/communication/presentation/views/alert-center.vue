<template>
  <section class="communication-view">
    <div class="view-header">
      <div>
        <span>Communication</span>
        <h2>Mensajes y centro de alertas</h2>
        <p>Notificaciones, mensajes del sistema y estados leido/destacado.</p>
      </div>
      <pv-button :label="`${communicationStore.unreadCount} sin leer`" icon="pi pi-bell" />
    </div>

    <div class="message-list">
      <article v-for="message in communicationStore.messages" :key="message.id" :class="{ unread: !message.read }">
        <button type="button" @click="communicationStore.toggleStarred(message.id)">
          <i :class="message.starred ? 'pi pi-star-fill' : 'pi pi-star'"></i>
        </button>
        <div>
          <strong>{{ message.subject }}</strong>
          <p>{{ message.body }}</p>
          <small>{{ message.sender }} - {{ message.sentAt }}</small>
        </div>
        <pv-button v-if="!message.read" label="Marcar leido" text @click="communicationStore.markAsRead(message.id)" />
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useCommunicationStore } from '../../application/communication.store.js';

const communicationStore = useCommunicationStore();

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
  border: 1px solid #e8ede9;
  border-radius: 8px;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.05);
}

.view-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 24px;
}

.view-header span {
  color: #3d9f7d;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.view-header h2 {
  color: #16251d;
  font-size: 26px;
  font-weight: 950;
  margin: 6px 0;
}

.view-header p {
  color: #66756b;
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
  border-color: #f08a24;
}

.message-list button {
  background: #f9fbf8;
  border: 1px solid #e8ede9;
  border-radius: 8px;
  color: #f08a24;
  cursor: pointer;
  height: 40px;
  width: 40px;
}

.message-list strong {
  color: #16251d;
  font-weight: 950;
}

.message-list p,
.message-list small {
  color: #66756b;
  display: block;
  font-weight: 700;
  margin: 4px 0 0;
}
</style>
