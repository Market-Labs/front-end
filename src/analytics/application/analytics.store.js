import { defineStore } from 'pinia';
import { AnalyticsApi } from '../infrastructure/analytics-api.js';

const analyticsApi = new AnalyticsApi();

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    indicators: [],
    reports: [],
    reportSummaries: {},
    reportSources: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchReportSources(isSupplier = false) {
      this.loading = true;
      this.error = null;
      try {
        this.reportSources = await analyticsApi.getReportSources(isSupplier);
      } catch {
        this.reportSources = null;
        this.error = 'No se pudieron cargar los datos para los reportes.';
      } finally {
        this.loading = false;
      }
    },
    async fetchSummary(isSupplier = false) {
      this.loading = true;
      try {
        const summary = await analyticsApi.getSummary(isSupplier);
        this.indicators = summary.indicators;
        this.reports = Object.keys(summary.reportSummaries);
        this.reportSummaries = summary.reportSummaries;
      } catch (error) {
        this.error = 'No se pudo cargar analítica desde la API.';
        this.indicators = [];
        this.reports = [];
        this.reportSummaries = {};
      } finally {
        this.loading = false;
      }
    },
  },
});
