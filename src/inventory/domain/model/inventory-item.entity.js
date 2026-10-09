export class InventoryItem {
  constructor({ id, productId, productName, stock, minimumStock, lotCode, expirationDate, status, stockUpdates = [], offers = [] }) {
    this.id = id;
    this.productId = productId;
    this.productName = productName;
    this.stock = stock;
    this.minimumStock = minimumStock;
    this.lotCode = lotCode;
    this.expirationDate = expirationDate;
    this.status = status;
    this.stockUpdates = stockUpdates;
    this.offers = offers;
  }

  get isLowStock() {
    return this.stock <= this.minimumStock;
  }
}
