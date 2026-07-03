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
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const notification_repository_interface_1 = require("../../domain/repositories/notification.repository.interface");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const notification_entity_1 = require("../../domain/entities/notification.entity");
const user_entity_1 = require("../../domain/entities/user.entity");
let NotificationService = class NotificationService {
    notificationRepository;
    userRepository;
    constructor(notificationRepository, userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    async notifyUser(userId, institutionId, title, description, type = 'info', priority = 'low') {
        const notification = new notification_entity_1.NotificationEntity('', title, description, type, priority, false, userId, institutionId);
        await this.notificationRepository.create(notification);
    }
    async notifyAdmins(institutionId, title, description, type = 'info', priority = 'low') {
        const users = await this.userRepository.findByInstitution(institutionId);
        const admins = users.filter((u) => u.role === user_entity_1.Role.ADMIN || u.role === user_entity_1.Role.SUPER_ADMIN || u.role === user_entity_1.Role.SECRETARY);
        if (admins.length === 0)
            return;
        const notifications = admins.map((admin) => new notification_entity_1.NotificationEntity('', title, description, type, priority, false, admin.id, institutionId));
        await this.notificationRepository.createMany(notifications);
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(notification_repository_interface_1.INotificationRepository)),
    __param(1, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object])
], NotificationService);
//# sourceMappingURL=notification.service.js.map