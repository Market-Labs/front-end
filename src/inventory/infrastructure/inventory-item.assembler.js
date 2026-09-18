import { InventoryItem } from '../domain/model/inventory-item.entity.js';

export const InventoryItemAssembler = {
  toEntity(resource) {
    return new InventoryItem(resource);
  },
};
