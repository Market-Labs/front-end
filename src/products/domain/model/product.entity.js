export class Product {
  constructor({ id, name, description, category, expirationDate, quantity, price, available, supplierId }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.expirationDate = expirationDate;
    this.quantity = quantity;
    this.price = price;
    this.available = available;
    this.supplierId = supplierId;
  }

  get formattedPrice() {
    return `S/ ${this.price.toFixed(2)}`;
  }
}
