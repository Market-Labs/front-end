import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { AnalyticsAssembler } from './analytics.assembler.js';

export class AnalyticsApi extends BaseApi {
  async getSummary() {
    const response = await this.http.get(apiEndpoints.analytics);
    return response.data.indicators.map(AnalyticsAssembler.toIndicator);
  }
}
