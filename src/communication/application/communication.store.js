import { defineStore } from 'pinia';
import { CommunicationApi } from '../infrastructure/communication-api.js';
import { Message } from '../domain/model/message.entity.js';

const communicationApi = new CommunicationApi();

const demoMessages = [
  new Message({ id: 'msg-1', sender: 'Sistema MarketGo', receiver: 'Ana Mercado', subject: 'Alerta de vencimiento', body: 'Yogurt organico vence pronto.', read: false, starred: true, sentAt: '2026-09-18 09:10' }),
  new Message({ id: 'msg-2', sender: 'BioAndes Organic', receiver: 'Ana Mercado', subject: 'Pedido enviado', body: 'La orden ORD-1001 fue enviada.', read: true, starred: false, sentAt: '2026-09-18 10:20' }),
  new Message({ id: 'msg-3', sender: 'Sensor Camara A', receiver: 'Ana Mercado', subject: 'Condicion estable', body: 'Temperatura y humedad dentro del rango.', read: false, starred: false, sentAt: '2026-09-18 11:00' }),
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
        this.error = 'No se pudo cargar comunicacion. Se muestran datos demo.';
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
