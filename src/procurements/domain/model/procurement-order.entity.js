export class ProcurementOrder {
  constructor({ id, supplier, minimarket, status, total, createdAt, items = [] }) {
    this.id = id;
    this.supplier = supplier;
    this.minimarket = minimarket;
    this.status = status;
    this.total = total;
    this.createdAt = createdAt;
    this.items = items;
  }

  get itemCount() {
    return this.items.length;
  }
}
