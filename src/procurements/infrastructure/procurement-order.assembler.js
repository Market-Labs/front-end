import { ProcurementOrder } from '../domain/model/procurement-order.entity.js';

export const ProcurementOrderAssembler = {
  toEntity(resource) {
    return new ProcurementOrder(resource);
  },
};
