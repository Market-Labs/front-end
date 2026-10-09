import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { MessageAssembler } from './message.assembler.js';

export class CommunicationApi extends BaseApi {
  async getNotifications() {
    const response = await this.http.get(apiEndpoints.notifications);
    return response.data.map(MessageAssembler.toEntity);
  }
}
