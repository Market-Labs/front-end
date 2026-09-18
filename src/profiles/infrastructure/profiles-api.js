import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { ProfileAssembler } from './profile.assembler.js';

export class ProfilesApi extends BaseApi {
  async getProfiles() {
    const response = await this.http.get(apiEndpoints.profiles);
    return response.data.map(ProfileAssembler.toEntity);
  }

  async updateProfile(id, payload) {
    const response = await this.http.patch(`${apiEndpoints.profiles}/${id}`, payload);
    return ProfileAssembler.toEntity(response.data);
  }
}
