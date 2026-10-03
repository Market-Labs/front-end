import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { ProcurementOrderAssembler } from './procurement-order.assembler.js';

export class ProcurementsApi extends BaseApi {
  async getOrders() {
    const response = await this.http.get(apiEndpoints.procurements);
    return response.data.map(ProcurementOrderAssembler.toEntity);
  }
  async createOrder(order) {
    const response = await this.http.post(apiEndpoints.procurements, order);
    return ProcurementOrderAssembler.toEntity(response.data);
  }
  async updateOrder(id, changes) {
    const response = await this.http.patch(`${apiEndpoints.procurements}/${encodeURIComponent(id)}`, changes);
    return ProcurementOrderAssembler.toEntity(response.data);
  }
}
