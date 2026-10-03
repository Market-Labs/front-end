import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { AnalyticsAssembler } from './analytics.assembler.js';

export class AnalyticsApi extends BaseApi {
  async getSummary(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierAnalytics : apiEndpoints.analytics);
    return {
      indicators: response.data.indicators.map(AnalyticsAssembler.toIndicator),
      reportSummaries: response.data.reportSummaries || {},
    };
  }
  async getReportSources(isSupplier = false) {
    const endpoints = {
      products: apiEndpoints.products,
      inventory: isSupplier ? apiEndpoints.supplierInventory : apiEndpoints.inventory,
      orders: apiEndpoints.procurements,
      waste: isSupplier ? apiEndpoints.supplierWaste : apiEndpoints.waste,
      conservation: isSupplier ? apiEndpoints.supplierConservationMonitoring : apiEndpoints.conservationMonitoring,
      suppliers: apiEndpoints.suppliers,
      sales: apiEndpoints.sales,
    };
    const entries = await Promise.all(Object.entries(endpoints).map(async ([key, endpoint]) => {
      const response = await this.http.get(endpoint);
      return [key, response.data];
    }));
    return Object.fromEntries(entries);
  }
}
