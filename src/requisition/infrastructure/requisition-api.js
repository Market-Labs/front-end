import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { RequisitionAssembler } from './requisition.assembler.js';

export class RequisitionApi extends BaseApi {
  async getRequisitions() {
    const response = await this.http.get(apiEndpoints.requisitions);
    return response.data.map(RequisitionAssembler.toEntity);
  }
}
