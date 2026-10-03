import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { DashboardAssembler } from './dashboard.assembler.js';

export class DashboardApi extends BaseApi {
  async getIndicators(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierDashboard : apiEndpoints.dashboard);
    return response.data.indicators.map(DashboardAssembler.toIndicator);
  }
}
