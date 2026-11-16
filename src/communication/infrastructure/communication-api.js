import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { MessageAssembler } from './message.assembler.js';

export class CommunicationApi extends BaseApi {
  async getNotifications(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierAlerts : apiEndpoints.conservationAlerts);
    return response.data.map(MessageAssembler.toEntity);
  }
  async getMessages(box = 'all') {
    const response = await this.http.get(apiEndpoints.notifications, { params: { box } });
    return response.data.map(MessageAssembler.toEntity);
  }
  async sendMessage({ receiverOrganizationId, subject, body, idempotencyKey = crypto.randomUUID() }) {
    const response = await this.http.post(apiEndpoints.notifications,
      { receiverOrganizationId, subject, body, idempotencyKey });
    return MessageAssembler.toEntity(response.data);
  }
  async updateAlert(id, changes, isSupplier = false) {
    const endpoint = isSupplier ? apiEndpoints.supplierAlerts : apiEndpoints.conservationAlerts;
    const response = await this.http.patch(`${endpoint}/${id}`, changes);
    return MessageAssembler.toEntity(response.data);
  }
  async updateMessage(id, changes) {
    const response = await this.http.patch(`${apiEndpoints.notifications}/${id}`, changes);
    return MessageAssembler.toEntity(response.data);
  }
}
