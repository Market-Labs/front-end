export class Product {
  constructor({ id, name, description, category, expirationDate = '', quantity = null, price, available, supplierId, organizationId = null }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.expirationDate = expirationDate;
    this.quantity = quantity;
    this.price = price;
    this.available = available;
    this.supplierId = supplierId;
    this.organizationId = organizationId;
  }

  get formattedPrice() {
    return `S/ ${this.price.toFixed(2)}`;
  }
}
