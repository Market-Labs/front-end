import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { InventoryItemAssembler } from './inventory-item.assembler.js';

export class InventoryApi extends BaseApi {
  async getInventory(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierInventory : apiEndpoints.inventory);
    return response.data.map(InventoryItemAssembler.toEntity);
  }
  async createItem(item, isSupplier = false) {
    const response = await this.http.post(isSupplier ? apiEndpoints.supplierInventory : apiEndpoints.inventory, item);
    return InventoryItemAssembler.toEntity(response.data);
  }
  async updateItem(id, changes, isSupplier = false) {
    const endpoint = isSupplier ? apiEndpoints.supplierInventory : apiEndpoints.inventory;
    const response = await this.http.patch(`${endpoint}/${encodeURIComponent(id)}`, changes);
    return InventoryItemAssembler.toEntity(response.data);
  }
  async deleteItem(id) {
    await this.http.delete(`${apiEndpoints.inventory}/${encodeURIComponent(id)}`);
  }
  async getWaste(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierWaste : apiEndpoints.waste);
    return response.data;
  }
  async createWaste(record) {
    const response = await this.http.post(apiEndpoints.waste, record);
    return response.data;
  }
}
