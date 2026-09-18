import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { ProcurementOrderAssembler } from './procurement-order.assembler.js';

export class ProcurementsApi extends BaseApi {
  async getOrders() {
    const response = await this.http.get(apiEndpoints.procurements);
    return response.data.map(ProcurementOrderAssembler.toEntity);
  }
}
