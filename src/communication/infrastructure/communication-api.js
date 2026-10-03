import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { MessageAssembler } from './message.assembler.js';

export class CommunicationApi extends BaseApi {
  async getNotifications(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierAlerts : apiEndpoints.conservationAlerts);
    return response.data.map(MessageAssembler.toEntity);
  }
}
