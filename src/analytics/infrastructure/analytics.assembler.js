import { OperationalIndicator } from '../domain/model/operational-indicator.entity.js';

export const AnalyticsAssembler = {
  toIndicator(resource) {
    return new OperationalIndicator(resource);
  },
};
