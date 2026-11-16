export class Supplier {
  constructor({ id, supplierOrganizationId = null, businessName, ruc, email, phone, address, specialty, coverageArea, status = 'active' }) {
    this.id = id;
    this.supplierOrganizationId = supplierOrganizationId;
    this.businessName = businessName;
    this.ruc = ruc;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.specialty = specialty;
    this.coverageArea = coverageArea;
    this.status = status;
  }
}
