import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';

export class ClientsApi extends BaseApi {
  async list() {
    const response = await this.http.get(apiEndpoints.clients);
    return response.data;
  }

  async create(payload) {
    const response = await this.http.post(apiEndpoints.clients, payload);
    return response.data;
  }

  async update(id, payload) {
    const response = await this.http.patch(`${apiEndpoints.clients}/${encodeURIComponent(id)}`, payload);
    return response.data;
  }
}