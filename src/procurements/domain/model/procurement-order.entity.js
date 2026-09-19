export class ProcurementOrder {
  constructor({
    id,
    supplyRequestId = null,
    supplierId = 'sup-2',
    minimarketId = 'min-1',
    supplier,
    minimarket,
    status,
    total,
    createdAt,
    shippingDate = null,
    receivedAt = null,
    observations = '',
    rejectionReason = '',
    reception = null,
    items = [],
  }) {
    this.id = id;
    this.supplyRequestId = supplyRequestId;
    this.supplierId = supplierId;
    this.minimarketId = minimarketId;
    this.supplier = supplier;
    this.minimarket = minimarket;
    this.status = status;
    this.total = total;
    this.createdAt = createdAt;
    this.shippingDate = shippingDate;
    this.receivedAt = receivedAt;
    this.observations = observations;
    this.rejectionReason = rejectionReason;
    this.reception = reception;
    this.items = items;
  }

  get itemCount() {
    return this.items.length;
  }

  get canBeReviewed() {
    return this.status === 'pending-reception';
  }
}
