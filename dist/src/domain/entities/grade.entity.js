"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeEntity = void 0;
class GradeEntity {
    id;
    studentId;
    subjectId;
    classId;
    term;
    value;
    teacherId;
    institutionId;
    createdAt;
    updatedAt;
    constructor(id, studentId, subjectId, classId, term, value, teacherId, institutionId, createdAt, updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.subjectId = subjectId;
        this.classId = classId;
        this.term = term;
        this.value = value;
        this.teacherId = teacherId;
        this.institutionId = institutionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.GradeEntity = GradeEntity;
//# sourceMappingURL=grade.entity.js.map