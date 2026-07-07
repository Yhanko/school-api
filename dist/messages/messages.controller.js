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
exports.MessagesController = void 0;
const common_1 = require("@nestjs/common");
const send_message_dto_1 = require("../presentation/dtos/send-message.dto");
const send_message_use_case_1 = require("../application/use-cases/send-message.use-case");
const message_repository_interface_1 = require("../domain/repositories/message.repository.interface");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
let MessagesController = class MessagesController {
    sendMessageUseCase;
    messageRepository;
    constructor(sendMessageUseCase, messageRepository) {
        this.sendMessageUseCase = sendMessageUseCase;
        this.messageRepository = messageRepository;
    }
    sendMessage(dto, user) {
        return this.sendMessageUseCase.execute(user.sub, dto, user.institutionId);
    }
    getConversation(userId, user) {
        return this.messageRepository.findConversation(user.sub, userId);
    }
    markAsRead(id) {
        return this.messageRepository.markAsRead(id);
    }
};
exports.MessagesController = MessagesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversation/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MessagesController.prototype, "markAsRead", null);
exports.MessagesController = MessagesController = __decorate([
    (0, common_1.Controller)('messages'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(1, (0, common_1.Inject)(message_repository_interface_1.IMessageRepository)),
    __metadata("design:paramtypes", [send_message_use_case_1.SendMessageUseCase, Object])
], MessagesController);
//# sourceMappingURL=messages.controller.js.map