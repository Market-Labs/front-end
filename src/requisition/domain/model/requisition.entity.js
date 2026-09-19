export class Requisition {
  constructor({
    id,
    minimarketId = 'min-1',
    supplierId = 'sup-2',
    requesterId = 'usr-admin',
    requester,
    supplier,
    productName,
    quantity,
    reason,
    status,
    createdAt,
    reviewedAt = null,
    rejectionReason = '',
    items = [],
    response = null,
    shippingOrderId = null,
  }) {
    this.id = id;
    this.minimarketId = minimarketId;
    this.supplierId = supplierId;
    this.requesterId = requesterId;
    this.requester = requester;
    this.supplier = supplier;
    this.productName = productName;
    this.quantity = quantity;
    this.reason = reason;
    this.status = status;
    this.createdAt = createdAt;
    this.reviewedAt = reviewedAt;
    this.rejectionReason = rejectionReason;
    this.items = items.length ? items : [{ productName, quantity }];
    this.response = response;
    this.shippingOrderId = shippingOrderId;
  }

  get canBeReviewed() {
    return this.status === 'pending';
  }

  get canGenerateShippingOrder() {
    return this.status === 'accepted' && !this.shippingOrderId;
  }
}
