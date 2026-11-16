import { defineStore } from 'pinia';
import { ClientsApi } from '../infrastructure/clients-api.js';

const api = new ClientsApi();

export const useClientsStore = defineStore('clients', {
  state: () => ({ clients: [], loading: false, error: null }),
  actions: {
    async fetchClients() {
      this.loading = true;
      this.error = null;
      try { this.clients = await api.list(); }
      catch (error) { this.error = error; this.clients = []; }
      finally { this.loading = false; }
    },
    async createClient(payload) {
      const client = await api.create(payload);
      this.clients.push(client);
      return client;
    },
    async updateClient(id, payload) {
      const client = await api.update(id, payload);
      this.clients = this.clients.map((entry) => entry.id === id ? client : entry);
      return client;
    },
  },
});