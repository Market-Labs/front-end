export class Product {
  constructor({ id, name, description, category, expirationDate, quantity, price, available }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.category = category;
    this.expirationDate = expirationDate;
    this.quantity = quantity;
    this.price = price;
    this.available = available;
  }

  get formattedPrice() {
    return `S/ ${this.price.toFixed(2)}`;
  }
}
