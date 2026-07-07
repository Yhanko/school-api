"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEntity = void 0;
class PaymentEntity {
    id;
    studentId;
    type;
    amount;
    institutionId;
    status;
    paymentDate;
    createdAt;
    updatedAt;
    student;
    constructor(id, studentId, type, amount, institutionId, status = 'pending', paymentDate, createdAt, updatedAt, student) {
        this.id = id;
        this.studentId = studentId;
        this.type = type;
        this.amount = amount;
        this.institutionId = institutionId;
        this.status = status;
        this.paymentDate = paymentDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.student = student;
    }
}
exports.PaymentEntity = PaymentEntity;
//# sourceMappingURL=payment.entity.js.map