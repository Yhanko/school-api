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
var EventsCronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsCronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const user_entity_1 = require("../domain/entities/user.entity");
let EventsCronService = EventsCronService_1 = class EventsCronService {
    prisma;
    logger = new common_1.Logger(EventsCronService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async handleCron() {
        this.logger.debug('A verificar eventos nas próximas 24h...');
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const upcomingEvents = await this.prisma.event.findMany({
            where: {
                date: {
                    gte: now,
                    lte: tomorrow,
                }
            }
        });
        if (upcomingEvents.length === 0)
            return;
        for (const event of upcomingEvents) {
            const usersToNotify = await this.prisma.user.findMany({
                where: {
                    institutionId: event.institutionId,
                    role: { in: [user_entity_1.Role.TEACHER, user_entity_1.Role.ADMIN, user_entity_1.Role.STUDENT] }
                }
            });
            const notifications = usersToNotify.map(user => ({
                userId: user.id,
                title: 'Lembrete de Evento',
                description: `O evento "${event.title}" começa amanhã. Não se esqueça!`,
                institutionId: event.institutionId
            }));
            if (notifications.length > 0) {
                await this.prisma.notification.createMany({
                    data: notifications
                });
            }
        }
        this.logger.debug(`Enviados lembretes para ${upcomingEvents.length} evento(s).`);
    }
};
exports.EventsCronService = EventsCronService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EventsCronService.prototype, "handleCron", null);
exports.EventsCronService = EventsCronService = EventsCronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsCronService);
//# sourceMappingURL=events.cron.js.map