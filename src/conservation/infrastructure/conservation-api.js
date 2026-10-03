import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { ConservationAssembler } from './conservation.assembler.js';

export class ConservationApi extends BaseApi {
  async getMonitoring(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierConservationMonitoring : apiEndpoints.conservationMonitoring);
    return response.data.map(ConservationAssembler.toEntity);
  }
}
