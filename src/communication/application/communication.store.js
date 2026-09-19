import { defineStore } from 'pinia';
import { CommunicationApi } from '../infrastructure/communication-api.js';
import { Message } from '../domain/model/message.entity.js';

const communicationApi = new CommunicationApi();

const demoMessages = [
  new Message({ id: 'alert-1', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Humedad elevada', body: 'Anaquel fresco supera el rango recomendado.', read: false, starred: true, sentAt: '2026-09-18 09:35' }),
  new Message({ id: 'alert-2', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Vencimiento cercano', body: 'Yogurt organico vence en 5 dias.', read: false, starred: false, sentAt: '2026-09-18 10:05' }),
  new Message({ id: 'alert-3', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Stock bajo', body: 'Leche organica se acerca al stock minimo.', read: false, starred: false, sentAt: '2026-09-18 10:30' }),
  new Message({ id: 'alert-4', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Orden pendiente', body: 'Anita Gamboa tiene una orden por confirmar.', read: true, starred: false, sentAt: '2026-09-18 11:20' }),
];

export const useCommunicationStore = defineStore('communication', {
  state: () => ({
    messages: demoMessages,
    loading: false,
    error: null,
  }),
  getters: {
    unreadCount: (state) => state.messages.filter((message) => !message.read).length,
  },
  actions: {
    async fetchMessages() {
      this.loading = true;
      try {
        this.messages = await communicationApi.getNotifications();
      } catch (error) {
        this.error = 'No se pudo cargar alertas. Se muestran datos demo.';
        this.messages = demoMessages;
      } finally {
        this.loading = false;
      }
    },
    markAsRead(id) {
      this.messages.find((message) => message.id === id)?.markAsRead();
    },
    toggleStarred(id) {
      this.messages.find((message) => message.id === id)?.toggleStarred();
    },
  },
});
