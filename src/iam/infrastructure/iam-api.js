import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { UserAssembler } from './user.assembler.js';

export class IamApi extends BaseApi {
  async signIn(credentials) {
    const response = await this.http.post(`${apiEndpoints.auth}/sign-in`, credentials);
    return response.data;
  }

  async signUp(payload) {
    const response = await this.http.post(`${apiEndpoints.auth}/sign-up`, payload);
    return response.data;
  }

  async getUsers() {
    const response = await this.http.get(apiEndpoints.users);
    return response.data.map(UserAssembler.toEntity);
  }
}
