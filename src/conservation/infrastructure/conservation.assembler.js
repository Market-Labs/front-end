import { ConservationRecord } from '../domain/model/conservation-record.entity.js';

export const ConservationAssembler = {
  toEntity(resource) {
    return new ConservationRecord(resource);
  },
};
