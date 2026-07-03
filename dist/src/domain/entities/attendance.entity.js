"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceEntity = void 0;
class AttendanceEntity {
    id;
    studentId;
    classId;
    date;
    status;
    teacherId;
    institutionId;
    subjectId;
    createdAt;
    updatedAt;
    constructor(id, studentId, classId, date, status, teacherId, institutionId, subjectId, createdAt, updatedAt) {
        this.id = id;
        this.studentId = studentId;
        this.classId = classId;
        this.date = date;
        this.status = status;
        this.teacherId = teacherId;
        this.institutionId = institutionId;
        this.subjectId = subjectId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.AttendanceEntity = AttendanceEntity;
//# sourceMappingURL=attendance.entity.js.map