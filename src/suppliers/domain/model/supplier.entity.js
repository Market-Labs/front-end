export class Supplier {
  constructor({ id, businessName, ruc, email, phone, address, specialty, coverageArea }) {
    this.id = id;
    this.businessName = businessName;
    this.ruc = ruc;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.specialty = specialty;
    this.coverageArea = coverageArea;
  }
}
