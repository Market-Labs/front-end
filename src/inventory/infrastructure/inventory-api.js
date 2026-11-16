import { BaseApi } from '../../shared/infrastructure/base-api.js';
import { apiEndpoints } from '../../shared/infrastructure/api-endpoints.js';
import { InventoryItemAssembler } from './inventory-item.assembler.js';

export class InventoryApi extends BaseApi {
  async getInventory(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierInventory : apiEndpoints.inventory);
    return response.data.map(InventoryItemAssembler.toEntity);
  }
  async createItem(item, isSupplier = false) {
    const { productId, stock, minimumStock, lotCode, expirationDate } = item;
    const response = await this.http.post(isSupplier ? apiEndpoints.supplierInventory : apiEndpoints.inventory,
      { productId, stock, minimumStock, lotCode, expirationDate });
    return InventoryItemAssembler.toEntity(response.data);
  }
  async updateItem(id, changes, isSupplier = false) {
    const endpoint = isSupplier ? apiEndpoints.supplierInventory : apiEndpoints.inventory;
    const response = await this.http.patch(`${endpoint}/${encodeURIComponent(id)}`,
      { stock: changes.stock ?? null, minimumStock: changes.minimumStock ?? null });
    return InventoryItemAssembler.toEntity(response.data);
  }
  async deleteItem(id) {
    await this.http.delete(`${apiEndpoints.inventory}/${encodeURIComponent(id)}`);
  }
  async getWaste(isSupplier = false) {
    const response = await this.http.get(isSupplier ? apiEndpoints.supplierWaste : apiEndpoints.waste);
    return response.data;
  }
  async createWaste(record, isSupplier = false) {
    const response = await this.http.post(isSupplier ? apiEndpoints.supplierWaste : apiEndpoints.waste,
      { inventoryItemId: record.inventoryItemId, quantity: record.quantity, reason: record.reason });
    return response.data;
  }
}
