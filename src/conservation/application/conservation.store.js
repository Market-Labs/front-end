import { defineStore } from 'pinia';
import { ConservationApi } from '../infrastructure/conservation-api.js';
import { ConservationRecord } from '../domain/model/conservation-record.entity.js';

const conservationApi = new ConservationApi();

const demoRecords = [
  new ConservationRecord({ id: 'con-1', zone: 'Camara fria A', productName: 'Yogurt organico', temperature: 4, humidity: 61, recordedAt: '2026-09-18 09:30', status: 'healthy' }),
  new ConservationRecord({ id: 'con-2', zone: 'Anaquel fresco', productName: 'Lechuga hidroponica', temperature: 9, humidity: 72, recordedAt: '2026-09-18 09:35', status: 'risk' }),
  new ConservationRecord({ id: 'con-3', zone: 'Almacen seco', productName: 'Quinua real', temperature: 19, humidity: 45, recordedAt: '2026-09-18 09:40', status: 'healthy' }),
];

export const useConservationStore = defineStore('conservation', {
  state: () => ({
    records: demoRecords,
    loading: false,
    error: null,
  }),
  getters: {
    riskCount: (state) => state.records.filter((record) => record.isRisky).length,
  },
  actions: {
    async fetchMonitoring() {
      this.loading = true;
      try {
        this.records = await conservationApi.getMonitoring();
      } catch (error) {
        this.error = 'No se pudo cargar monitoreo. Se muestran datos demo.';
        this.records = demoRecords;
      } finally {
        this.loading = false;
      }
    },
  },
});
