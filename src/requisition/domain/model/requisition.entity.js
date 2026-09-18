export class Requisition {
  constructor({ id, requester, productName, quantity, reason, status, createdAt }) {
    this.id = id;
    this.requester = requester;
    this.productName = productName;
    this.quantity = quantity;
    this.reason = reason;
    this.status = status;
    this.createdAt = createdAt;
  }

  get canBeReviewed() {
    return this.status === 'pending';
  }
}
