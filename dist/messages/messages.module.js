"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesModule = void 0;
const common_1 = require("@nestjs/common");
const messages_controller_1 = require("./messages.controller");
const send_message_use_case_1 = require("../application/use-cases/send-message.use-case");
const message_repository_interface_1 = require("../domain/repositories/message.repository.interface");
const prisma_message_repository_1 = require("../infrastructure/database/prisma-message.repository");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
let MessagesModule = class MessagesModule {
};
exports.MessagesModule = MessagesModule;
exports.MessagesModule = MessagesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        controllers: [messages_controller_1.MessagesController],
        providers: [
            send_message_use_case_1.SendMessageUseCase,
            {
                provide: message_repository_interface_1.IMessageRepository,
                useClass: prisma_message_repository_1.PrismaMessageRepository,
            }
        ],
    })
], MessagesModule);
//# sourceMappingURL=messages.module.js.map