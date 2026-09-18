import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { InventoryItemAssembler } from './inventory-item.assembler.js';

export class InventoryApi extends BaseApi {
  async getInventory() {
    const response = await this.http.get(apiEndpoints.inventory);
    return response.data.map(InventoryItemAssembler.toEntity);
  }
}
