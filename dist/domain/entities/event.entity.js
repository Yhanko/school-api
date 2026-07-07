"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEntity = void 0;
class EventEntity {
    id;
    title;
    description;
    date;
    type;
    organizer;
    location;
    participants;
    institutionId;
    createdAt;
    updatedAt;
    constructor(id, title, description, date, type, organizer, location, participants, institutionId, createdAt, updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.date = date;
        this.type = type;
        this.organizer = organizer;
        this.location = location;
        this.participants = participants;
        this.institutionId = institutionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.EventEntity = EventEntity;
//# sourceMappingURL=event.entity.js.map