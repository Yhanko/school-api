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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageUseCase = void 0;
const common_1 = require("@nestjs/common");
const message_repository_interface_1 = require("../../domain/repositories/message.repository.interface");
const message_entity_1 = require("../../domain/entities/message.entity");
const prisma_service_1 = require("../../prisma/prisma.service");
let SendMessageUseCase = class SendMessageUseCase {
    messageRepository;
    prisma;
    constructor(messageRepository, prisma) {
        this.messageRepository = messageRepository;
        this.prisma = prisma;
    }
    async execute(senderId, dto, institutionId) {
        const messageEntity = new message_entity_1.MessageEntity('', senderId, dto.receiverId, dto.content, false, institutionId);
        const createdMessage = await this.messageRepository.create(messageEntity);
        try {
            const sender = await this.prisma.user.findUnique({
                where: { id: senderId },
                select: { name: true },
            });
            const senderName = sender?.name || 'Alguém';
            const preview = dto.content.length > 60 ? `${dto.content.substring(0, 60)}...` : dto.content;
            await this.prisma.notification.create({
                data: {
                    userId: dto.receiverId,
                    title: `💬 Nova Mensagem de ${senderName}`,
                    description: `"${preview}"`,
                    institutionId,
                },
            });
        }
        catch (e) {
            console.warn('Failed to send message notification:', e);
        }
        return createdMessage;
    }
};
exports.SendMessageUseCase = SendMessageUseCase;
exports.SendMessageUseCase = SendMessageUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(message_repository_interface_1.IMessageRepository)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], SendMessageUseCase);
//# sourceMappingURL=send-message.use-case.js.map