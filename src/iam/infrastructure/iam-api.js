import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { UserAssembler } from './user.assembler.js';

export class IamApi extends BaseApi {
  async signIn(credentials) {
    const response = await this.http.get(`${apiEndpoints.auth}/accounts`);
    const account = response.data.find((entry) => (
      entry.email.toLowerCase() === credentials.email && entry.password === credentials.password
    ));
    if (!account) throw new Error('invalid-credentials');
    return { userId: account.userId };
  }

  async signUp(payload) {
    const response = await this.http.post(`${apiEndpoints.auth}/sign-up`, payload);
    return response.data;
  }

  async getUsers() {
    const response = await this.http.get(apiEndpoints.users);
    return response.data.map(UserAssembler.toEntity);
  }
  async updateUser(id, changes) {
    const response = await this.http.patch(`${apiEndpoints.users}/${encodeURIComponent(id)}`, changes);
    return UserAssembler.toEntity(response.data);
  }
}
