"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassEntity = void 0;
class ClassEntity {
    id;
    name;
    period;
    academicLevel;
    room;
    capacity;
    institutionId;
    teachers;
    createdAt;
    updatedAt;
    constructor(id, name, period, academicLevel, room, capacity, institutionId, teachers, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.period = period;
        this.academicLevel = academicLevel;
        this.room = room;
        this.capacity = capacity;
        this.institutionId = institutionId;
        this.teachers = teachers;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.ClassEntity = ClassEntity;
//# sourceMappingURL=class.entity.js.map