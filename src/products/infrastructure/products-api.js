import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { apiUser } from '../../shared/infrastructure/api-session.js';
import { ProductAssembler } from './product.assembler.js';

export class ProductsApi extends BaseApi {
  async getProducts(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierProducts : apiEndpoints.products);
    const resources = await Promise.all(response.data.map(async (resource) => {
      if (isSupplier) return { ...resource, organizationId: apiUser().organizationId, supplierId: apiUser().organizationId };
      if (resource.organizationId !== apiUser()?.organizationId) return resource;
      const detail = await this.http.get(`${apiEndpoints.products}/${resource.id}`);
      return { ...detail.data, organizationId: resource.organizationId };
    }));
    return resources.map(ProductAssembler.toEntity);
  }

  async createProduct(product) {
    const { id, available, ...payload } = product;
    const response = await this.http.post(apiEndpoints.products, {
      ...payload, supplierId: apiUser()?.accountType === 'supplier' ? null : payload.supplierId,
    });
    return ProductAssembler.toEntity({ ...response.data, organizationId: apiUser().organizationId,
      supplierId: apiUser().accountType === 'supplier' ? apiUser().organizationId : response.data.supplierId });
  }

  async updateProduct(id, changes) {
    const response = await this.http.patch(`${apiEndpoints.products}/${encodeURIComponent(id)}`, changes);
    return ProductAssembler.toEntity({ ...response.data, organizationId: apiUser().organizationId,
      supplierId: apiUser().accountType === 'supplier' ? apiUser().organizationId : response.data.supplierId });
  }

  async deleteProduct(id) {
    await this.http.delete(`${apiEndpoints.products}/${encodeURIComponent(id)}`);
  }
}
