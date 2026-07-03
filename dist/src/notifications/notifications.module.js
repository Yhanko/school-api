"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_controller_1 = require("./notifications.controller");
const notification_service_1 = require("../application/services/notification.service");
const get_notifications_use_case_1 = require("../application/use-cases/get-notifications.use-case");
const mark_notification_read_use_case_1 = require("../application/use-cases/mark-notification-read.use-case");
const mark_all_notifications_read_use_case_1 = require("../application/use-cases/mark-all-notifications-read.use-case");
const notification_repository_interface_1 = require("../domain/repositories/notification.repository.interface");
const prisma_notification_repository_1 = require("../infrastructure/database/prisma-notification.repository");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const prisma_user_repository_1 = require("../infrastructure/database/prisma-user.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notification_service_1.NotificationService,
            get_notifications_use_case_1.GetNotificationsUseCase,
            mark_notification_read_use_case_1.MarkNotificationReadUseCase,
            mark_all_notifications_read_use_case_1.MarkAllNotificationsReadUseCase,
            {
                provide: notification_repository_interface_1.INotificationRepository,
                useClass: prisma_notification_repository_1.PrismaNotificationRepository,
            },
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            }
        ],
        exports: [notification_service_1.NotificationService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map