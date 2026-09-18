export class ConservationRecord {
  constructor({ id, zone, productName, temperature, humidity, recordedAt, status }) {
    this.id = id;
    this.zone = zone;
    this.productName = productName;
    this.temperature = temperature;
    this.humidity = humidity;
    this.recordedAt = recordedAt;
    this.status = status;
  }

  get isRisky() {
    return this.status === 'risk';
  }
}
