"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEntity = void 0;
class RoomEntity {
    id;
    name;
    capacity;
    institutionId;
    floor;
    createdAt;
    updatedAt;
    constructor(id, name, capacity, institutionId, floor, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.capacity = capacity;
        this.institutionId = institutionId;
        this.floor = floor;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.RoomEntity = RoomEntity;
//# sourceMappingURL=room.entity.js.map