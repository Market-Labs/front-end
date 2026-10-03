import { BaseApi } from './base-api.js';
import { apiEndpoints } from './api-endpoints.js';

export class DashboardOverviewApi extends BaseApi {
  async getOverview(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierDashboard : apiEndpoints.dashboard);
    return response.data;
  }
}
