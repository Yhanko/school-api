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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const get_notifications_use_case_1 = require("../application/use-cases/get-notifications.use-case");
const mark_notification_read_use_case_1 = require("../application/use-cases/mark-notification-read.use-case");
const mark_all_notifications_read_use_case_1 = require("../application/use-cases/mark-all-notifications-read.use-case");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
let NotificationsController = class NotificationsController {
    getNotificationsUseCase;
    markNotificationReadUseCase;
    markAllNotificationsReadUseCase;
    constructor(getNotificationsUseCase, markNotificationReadUseCase, markAllNotificationsReadUseCase) {
        this.getNotificationsUseCase = getNotificationsUseCase;
        this.markNotificationReadUseCase = markNotificationReadUseCase;
        this.markAllNotificationsReadUseCase = markAllNotificationsReadUseCase;
    }
    getNotifications(user) {
        return this.getNotificationsUseCase.execute(user.sub);
    }
    markAllAsRead(user) {
        return this.markAllNotificationsReadUseCase.execute(user.sub);
    }
    markAsRead(id) {
        return this.markNotificationReadUseCase.execute(id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('read-all'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [get_notifications_use_case_1.GetNotificationsUseCase,
        mark_notification_read_use_case_1.MarkNotificationReadUseCase,
        mark_all_notifications_read_use_case_1.MarkAllNotificationsReadUseCase])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map