"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeProfileEntity = void 0;
class EmployeeProfileEntity {
    id;
    userId;
    phone;
    address;
    photoUrl;
    university;
    degree;
    educationPeriod;
    city;
    cvUrl;
    biUrl;
    constructor(id, userId, phone, address, photoUrl, university, degree, educationPeriod, city, cvUrl, biUrl) {
        this.id = id;
        this.userId = userId;
        this.phone = phone;
        this.address = address;
        this.photoUrl = photoUrl;
        this.university = university;
        this.degree = degree;
        this.educationPeriod = educationPeriod;
        this.city = city;
        this.cvUrl = cvUrl;
        this.biUrl = biUrl;
    }
}
exports.EmployeeProfileEntity = EmployeeProfileEntity;
//# sourceMappingURL=employee-profile.entity.js.map