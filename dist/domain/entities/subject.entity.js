"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectEntity = void 0;
class SubjectEntity {
    id;
    name;
    institutionId;
    code;
    createdAt;
    updatedAt;
    constructor(id, name, institutionId, code, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.institutionId = institutionId;
        this.code = code;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.SubjectEntity = SubjectEntity;
//# sourceMappingURL=subject.entity.js.map