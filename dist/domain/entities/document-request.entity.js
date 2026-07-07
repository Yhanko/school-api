"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRequestEntity = void 0;
class DocumentRequestEntity {
    id;
    studentId;
    type;
    status;
    institutionId;
    issuedDate;
    createdAt;
    updatedAt;
    constructor(id, studentId, type, status, institutionId, issuedDate, createdAt, updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.type = type;
        this.status = status;
        this.institutionId = institutionId;
        this.issuedDate = issuedDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.DocumentRequestEntity = DocumentRequestEntity;
//# sourceMappingURL=document-request.entity.js.map