import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { Sale } from '../domain/model/sale.entity.js';

export class SalesApi extends BaseApi {
  async getRetailSales() {
    const response = await this.http.get(apiEndpoints.sales);
    return response.data.map((data) => new Sale(data));
  }

  async createRetailSale(data) {
    const response = await this.http.post(apiEndpoints.sales, data);
    return new Sale(response.data);
  }
}
