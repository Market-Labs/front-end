export class InventoryItem {
  constructor({ id, productName, stock, minimumStock, lotCode, expirationDate, status, stockUpdates = [] }) {
    this.id = id;
    this.productName = productName;
    this.stock = stock;
    this.minimumStock = minimumStock;
    this.lotCode = lotCode;
    this.expirationDate = expirationDate;
    this.status = status;
    this.stockUpdates = stockUpdates;
  }

  get isLowStock() {
    return this.stock <= this.minimumStock;
  }
}
