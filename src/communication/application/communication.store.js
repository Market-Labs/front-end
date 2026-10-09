import { defineStore } from 'pinia';
import { CommunicationApi } from '../infrastructure/communication-api.js';
import { Message } from '../domain/model/message.entity.js';
import { isFirebaseMode } from '../../shared/infrastructure/firebase-client.js';
import { useInventoryStore } from '../../inventory/application/inventory.store.js';
import { useConservationStore } from '../../conservation/application/conservation.store.js';
import { operationalAlerts } from '../domain/model/operational-alerts.js';
import i18n from '../../i18n.js';
import { useIamStore } from '../../iam/application/iam.store.js';

const communicationApi = new CommunicationApi();

const demoMessages = [
  new Message({ id: 'alert-1', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Humedad elevada', body: 'Anaquel fresco supera el rango recomendado.', read: false, starred: true, sentAt: '2026-09-18 09:35' }),
  new Message({ id: 'alert-2', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Vencimiento cercano', body: 'Yogurt organico vence en 5 dias.', read: false, starred: false, sentAt: '2026-09-18 10:05' }),
  new Message({ id: 'alert-3', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Stock bajo', body: 'Leche organica se acerca al stock minimo.', read: false, starred: false, sentAt: '2026-09-18 10:30' }),
  new Message({ id: 'alert-4', sender: 'Sistema MarketGo', receiver: 'Minimarket Verde Sur', subject: 'Orden pendiente', body: 'Anita Gamboa tiene una orden por confirmar.', read: true, starred: false, sentAt: '2026-09-18 11:20' }),
];

export const useCommunicationStore = defineStore('communication', {
  state: () => ({
    messages: isFirebaseMode ? [] : demoMessages,
    ownerKey: null,
    loading: false,
    error: null,
  }),
  getters: {
    unreadCount: (state) => state.messages.filter((message) => !message.read).length,
  },
  actions: {
    async fetchMessages(isSupplier = false) {
      this.loading = true;
      try {
        const ownerKey = useIamStore().currentUser?.id || null;
        const inventory = useInventoryStore();
        const conservation = useConservationStore();
        const [messages] = await Promise.all([
          communicationApi.getNotifications(isSupplier),
          inventory.fetchInventory(isSupplier),
          conservation.fetchMonitoring(isSupplier),
        ]);
        const previous = new Map((this.ownerKey === ownerKey ? this.messages : []).map((message) => [message.id, message]));
        const generated = operationalAlerts(inventory.items, conservation.records, i18n.global.t);
        this.messages = [...messages, ...generated.filter((alert) => !messages.some((message) => message.body === alert.body))]
          .map((message) => new Message({ ...message, read: previous.get(message.id)?.read ?? message.read, starred: previous.get(message.id)?.starred ?? message.starred }));
        this.ownerKey = ownerKey;
      } catch (error) {
        this.error = isFirebaseMode ? 'No se pudo cargar alertas desde Firestore.' : 'No se pudo cargar alertas. Se muestran datos demo.';
        this.messages = isSupplier || isFirebaseMode ? [] : demoMessages;
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
