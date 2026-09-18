import { Supplier } from '../domain/model/supplier.entity.js';

export const SupplierAssembler = {
  toEntity(resource) {
    return new Supplier(resource);
  },
};
