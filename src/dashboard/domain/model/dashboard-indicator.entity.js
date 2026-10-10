export class DashboardIndicator {
  constructor({ title, type, value, variation = 0, severity = 'normal' }) {
    this.title = title;
    this.type = type;
    this.value = value;
    this.variation = variation;
    this.severity = severity;
  }
}
