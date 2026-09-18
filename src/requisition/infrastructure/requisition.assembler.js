import { Requisition } from '../domain/model/requisition.entity.js';

export const RequisitionAssembler = {
  toEntity(resource) {
    return new Requisition(resource);
  },
};
