import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { SupplierAssembler } from './supplier.assembler.js';

export class SuppliersApi extends BaseApi {
  async getSuppliers() {
    const response = await this.http.get(apiEndpoints.suppliers);
    return response.data.map(SupplierAssembler.toEntity);
  }
}
