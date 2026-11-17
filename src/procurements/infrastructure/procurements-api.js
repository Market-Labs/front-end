import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { ProcurementOrderAssembler } from './procurement-order.assembler.js';

export class ProcurementsApi extends BaseApi {
  async getOrders() {
    const response = await this.http.get(apiEndpoints.procurements);
    return response.data.map(ProcurementOrderAssembler.toEntity);
  }
  async createOrder(order) {
    const response = await this.http.post(apiEndpoints.procurements, {
      supplyRequestId: order.supplyRequestId || null, minimarketId: order.minimarketId || null,
      clientContactId: order.clientContactId || null, supplier: order.supplier,
      minimarket: order.minimarket, shippingDate: order.shippingDate,
      observations: order.observations || null,
      items: order.items.map(({ productName, quantity, unitPrice }) => ({ productName, quantity, unitPrice })),
    });
    return ProcurementOrderAssembler.toEntity(response.data);
  }
  async updateOrder(id, changes) {
    const response = await this.http.patch(`${apiEndpoints.procurements}/${encodeURIComponent(id)}`, {
      status: changes.status, rejectionReason: changes.rejectionReason || null,
      receivedLines: changes.receivedLines || null,
    });
    return ProcurementOrderAssembler.toEntity(response.data);
  }
}
