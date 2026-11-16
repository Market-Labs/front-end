import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { UserAssembler } from './user.assembler.js';

export class IamApi extends BaseApi {
  async signIn({ email, password }) {
    const response = await this.http.post(`${apiEndpoints.auth}/sign-in`, { email, password });
    return { token: response.data.token, user: UserAssembler.toEntity(response.data.user) };
  }

  async signUp({ name, email, password, businessName, type, acceptedTerms }) {
    const response = await this.http.post(`${apiEndpoints.auth}/sign-up`, {
      fullName: name, email, password, organizationName: businessName,
      accountType: type === 'admin' ? 'minimarket' : 'supplier', acceptedTerms,
    });
    return { token: response.data.token, user: UserAssembler.toEntity(response.data.user) };
  }

  async me() {
    const response = await this.http.get(`${apiEndpoints.auth}/me`);
    return UserAssembler.toEntity(response.data);
  }

  async getUsers() {
    const response = await this.http.get(apiEndpoints.users);
    return response.data.map(UserAssembler.toEntity);
  }
}
