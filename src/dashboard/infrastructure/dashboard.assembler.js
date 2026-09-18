import { DashboardIndicator } from '../domain/model/dashboard-indicator.entity.js';

export const DashboardAssembler = {
  toIndicator(resource) {
    return new DashboardIndicator(resource);
  },
};
