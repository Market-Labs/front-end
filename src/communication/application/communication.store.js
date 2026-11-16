import { defineStore } from 'pinia';
import { CommunicationApi } from '../infrastructure/communication-api.js';
import { useIamStore } from '../../iam/application/iam.store.js';

const communicationApi = new CommunicationApi();

export const useCommunicationStore = defineStore('communication', {
  state: () => ({ messages: [], ownerKey: null, loading: false, error: null }),
  getters: { unreadCount: (state) => state.messages.filter((message) => !message.read).length },
  actions: {
    async fetchMessages(isSupplier = useIamStore().isSupplier) {
      this.loading = true;
      this.error = null;
      try {
        this.messages = await communicationApi.getNotifications(isSupplier);
        this.ownerKey = useIamStore().currentUser?.organizationId;
      } catch {
        this.messages = [];
        this.error = 'No se pudo cargar alertas desde la API.';
      } finally { this.loading = false; }
    },
    async markAsRead(id) {
      const updated = await communicationApi.updateAlert(id, { read: true }, useIamStore().isSupplier);
      this.messages = this.messages.map((message) => message.id === id ? updated : message);
    },
    async toggleStarred(id) {
      const message = this.messages.find((entry) => entry.id === id);
      if (!message) return;
      const updated = await communicationApi.updateAlert(id, { starred: !message.starred }, useIamStore().isSupplier);
      this.messages = this.messages.map((entry) => entry.id === id ? updated : entry);
    },
  },
});
