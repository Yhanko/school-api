"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEntity = void 0;
class NotificationEntity {
    id;
    title;
    description;
    type;
    priority;
    isRead;
    userId;
    institutionId;
    createdAt;
    constructor(id, title, description, type, priority, isRead, userId, institutionId, createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.type = type;
        this.priority = priority;
        this.isRead = isRead;
        this.userId = userId;
        this.institutionId = institutionId;
        this.createdAt = createdAt;
    }
}
exports.NotificationEntity = NotificationEntity;
//# sourceMappingURL=notification.entity.js.map