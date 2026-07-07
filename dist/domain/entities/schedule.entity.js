"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleEntity = void 0;
class ScheduleEntity {
    id;
    classId;
    subjectId;
    teacherId;
    roomId;
    dayOfWeek;
    startTime;
    endTime;
    institutionId;
    createdAt;
    updatedAt;
    constructor(id, classId, subjectId, teacherId, roomId, dayOfWeek, startTime, endTime, institutionId, createdAt, updatedAt) {
        this.id = id;
        this.classId = classId;
        this.subjectId = subjectId;
        this.teacherId = teacherId;
        this.roomId = roomId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.institutionId = institutionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ScheduleEntity = ScheduleEntity;
//# sourceMappingURL=schedule.entity.js.map