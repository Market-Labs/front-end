import { BaseApi } from './base-api.js';
import { apiEndpoints } from './api-endpoints.js';

export class DashboardOverviewApi extends BaseApi {
  async getOverview() {
    const response = await this.http.get(apiEndpoints.dashboard);
    return response.data;
  }
}
