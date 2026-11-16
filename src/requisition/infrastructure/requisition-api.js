import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { RequisitionAssembler } from './requisition.assembler.js';

export class RequisitionApi extends BaseApi {
  async getRequisitions() {
    const response = await this.http.get(apiEndpoints.requisitions);
    return response.data.map(RequisitionAssembler.toEntity);
  }
  async createRequisition(request) {
    const response = await this.http.post(apiEndpoints.requisitions, {
      supplierOrganizationId: request.supplierOrganizationId,
      supplier: request.supplier,
      reason: request.reason,
      items: request.items.map(({ productName, quantity }) => ({ productName, quantity })),
    });
    return RequisitionAssembler.toEntity(response.data);
  }
  async updateRequisition(id, changes) {
    const response = await this.http.patch(`${apiEndpoints.requisitions}/${id}`, {
      status: changes.status, rejectionReason: changes.rejectionReason || null,
    });
    return RequisitionAssembler.toEntity(response.data);
  }
}
