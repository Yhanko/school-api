"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMessageRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const message_entity_1 = require("../../domain/entities/message.entity");
let PrismaMessageRepository = class PrismaMessageRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new message_entity_1.MessageEntity(model.id, model.senderId, model.receiverId, model.content, model.read, model.institutionId, model.createdAt);
    }
    async create(message) {
        const created = await this.prisma.message.create({
            data: {
                senderId: message.senderId,
                receiverId: message.receiverId,
                content: message.content,
                read: message.read,
                institutionId: message.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findConversation(userId1, userId2) {
        const messages = await this.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId1, receiverId: userId2 },
                    { senderId: userId2, receiverId: userId1 },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });
        return messages.map((m) => this.mapToEntity(m));
    }
    async markAsRead(messageId) {
        await this.prisma.message.update({
            where: { id: messageId },
            data: { read: true },
        });
    }
};
exports.PrismaMessageRepository = PrismaMessageRepository;
exports.PrismaMessageRepository = PrismaMessageRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaMessageRepository);
//# sourceMappingURL=prisma-message.repository.js.map