export class Sale {
  constructor({ id, minimarketId, customer, occurredAt, items = [], discount = 0, sourceOrderId = null, supplierId = null, type = 'retail' }) {
    this.id = id;
    this.minimarketId = minimarketId;
    this.customer = customer;
    this.occurredAt = occurredAt;
    this.items = items;
    this.discount = Number(discount);
    this.sourceOrderId = sourceOrderId;
    this.supplierId = supplierId;
    this.type = type;
  }

  get subtotal() {
    return this.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);
  }

  get total() {
    return Number(Math.max(0, this.subtotal - this.discount).toFixed(2));
  }

  get itemCount() {
    return this.items.length;
  }
}

export const saleFromReceivedOrder = (order) => new Sale({
  id: `sale-${order.id}`,
  minimarketId: order.minimarketId,
  supplierId: order.supplierId,
  customer: order.minimarket,
  occurredAt: order.receivedAt || order.shippingDate,
  sourceOrderId: order.id,
  type: 'supplier',
  items: order.items,
});
