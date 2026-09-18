import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { ProductAssembler } from './product.assembler.js';

export class ProductsApi extends BaseApi {
  async getProducts() {
    const response = await this.http.get(apiEndpoints.products);
    return response.data.map(ProductAssembler.toEntity);
  }
}
