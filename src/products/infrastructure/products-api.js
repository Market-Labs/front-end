import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { ProductAssembler } from './product.assembler.js';

export class ProductsApi extends BaseApi {
  async getProducts() {
    const response = await this.http.get(apiEndpoints.products);
    return response.data.map(ProductAssembler.toEntity);
  }

  async createProduct(product) {
    const response = await this.http.post(apiEndpoints.products, product);
    return ProductAssembler.toEntity(response.data);
  }

  async updateProduct(id, changes) {
    const response = await this.http.patch(`${apiEndpoints.products}/${encodeURIComponent(id)}`, changes);
    return ProductAssembler.toEntity(response.data);
  }

  async deleteProduct(id) {
    await this.http.delete(`${apiEndpoints.products}/${encodeURIComponent(id)}`);
  }
}
