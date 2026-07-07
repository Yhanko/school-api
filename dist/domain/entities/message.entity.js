"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEntity = void 0;
class MessageEntity {
    id;
    senderId;
    receiverId;
    content;
    read;
    institutionId;
    createdAt;
    constructor(id, senderId, receiverId, content, read, institutionId, createdAt) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.read = read;
        this.institutionId = institutionId;
        this.createdAt = createdAt;
    }
}
exports.MessageEntity = MessageEntity;
//# sourceMappingURL=message.entity.js.map