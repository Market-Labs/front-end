export class OperationalIndicator {
  constructor({ label, currentValue, previousValue, unit = '' }) {
    this.label = label;
    this.currentValue = currentValue;
    this.previousValue = previousValue;
    this.unit = unit;
  }

  get variation() {
    if (!this.previousValue) return 0;
    return Math.round(((this.currentValue - this.previousValue) / this.previousValue) * 100);
  }
}
