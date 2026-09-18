export class Profile {
  constructor({ id, userId, type, businessName, phone, address, district, specialty, coverageArea }) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.businessName = businessName;
    this.phone = phone;
    this.address = address;
    this.district = district;
    this.specialty = specialty;
    this.coverageArea = coverageArea;
  }

  get displayArea() {
    return this.coverageArea || this.district || 'Sin zona asignada';
  }
}
