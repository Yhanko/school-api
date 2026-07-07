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
exports.PrismaNotificationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const notification_entity_1 = require("../../domain/entities/notification.entity");
let PrismaNotificationRepository = class PrismaNotificationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(notification) {
        const created = await this.prisma.notification.create({
            data: {
                title: notification.title,
                description: notification.description,
                type: notification.type,
                priority: notification.priority,
                userId: notification.userId,
                institutionId: notification.institutionId,
                isRead: notification.isRead,
            },
        });
        return new notification_entity_1.NotificationEntity(created.id, created.title, created.description, created.type, created.priority, created.isRead, created.userId, created.institutionId, created.createdAt);
    }
    async createMany(notifications) {
        if (notifications.length === 0)
            return;
        await this.prisma.notification.createMany({
            data: notifications.map(n => ({
                title: n.title,
                description: n.description,
                type: n.type,
                priority: n.priority,
                userId: n.userId,
                institutionId: n.institutionId,
                isRead: n.isRead,
            })),
        });
    }
    async findByUserId(userId, limit = 50) {
        const notifications = await this.prisma.notification.findMany({
            where: { userId },
            orderBy: [
                { isRead: 'asc' },
                { createdAt: 'desc' },
            ],
            take: limit,
        });
        return notifications.map(n => new notification_entity_1.NotificationEntity(n.id, n.title, n.description, n.type, n.priority, n.isRead, n.userId, n.institutionId, n.createdAt));
    }
    async markAsRead(id) {
        await this.prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.PrismaNotificationRepository = PrismaNotificationRepository;
exports.PrismaNotificationRepository = PrismaNotificationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaNotificationRepository);
//# sourceMappingURL=prisma-notification.repository.js.map