"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplinaryEntity = exports.DisciplinaryStatus = exports.SeverityLevel = void 0;
var SeverityLevel;
(function (SeverityLevel) {
    SeverityLevel["LOW"] = "LOW";
    SeverityLevel["MEDIUM"] = "MEDIUM";
    SeverityLevel["HIGH"] = "HIGH";
})(SeverityLevel || (exports.SeverityLevel = SeverityLevel = {}));
var DisciplinaryStatus;
(function (DisciplinaryStatus) {
    DisciplinaryStatus["PENDING"] = "PENDING";
    DisciplinaryStatus["IN_PROGRESS"] = "IN_PROGRESS";
    DisciplinaryStatus["RESOLVED"] = "RESOLVED";
})(DisciplinaryStatus || (exports.DisciplinaryStatus = DisciplinaryStatus = {}));
class DisciplinaryEntity {
    id;
    studentId;
    type;
    severity;
    status;
    description;
    date;
    reportedById;
    institutionId;
    createdAt;
    updatedAt;
    constructor(id, studentId, type, severity, status, description, date, reportedById, institutionId, createdAt, updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.type = type;
        this.severity = severity;
        this.status = status;
        this.description = description;
        this.date = date;
        this.reportedById = reportedById;
        this.institutionId = institutionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.DisciplinaryEntity = DisciplinaryEntity;
//# sourceMappingURL=disciplinary.entity.js.map