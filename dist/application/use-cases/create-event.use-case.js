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
exports.CreateEventUseCase = void 0;
const common_1 = require("@nestjs/common");
const event_repository_interface_1 = require("../../domain/repositories/event.repository.interface");
const event_entity_1 = require("../../domain/entities/event.entity");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_entity_1 = require("../../domain/entities/user.entity");
let CreateEventUseCase = class CreateEventUseCase {
    eventRepository;
    prisma;
    constructor(eventRepository, prisma) {
        this.eventRepository = eventRepository;
        this.prisma = prisma;
    }
    async execute(dto, institutionId) {
        if (!institutionId) {
            throw new common_1.BadRequestException('Institution ID is required');
        }
        const eventEntity = new event_entity_1.EventEntity('', dto.title, dto.description, new Date(dto.date), dto.type, dto.organizer, dto.location, dto.participants, institutionId);
        const createdEvent = await this.eventRepository.create(eventEntity);
        try {
            const dateFormatted = new Date(dto.date).toLocaleDateString('pt-PT', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
            });
            const usersToNotify = await this.prisma.user.findMany({
                where: {
                    institutionId,
                    role: { in: [user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.TEACHER, user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT] },
                },
                select: { id: true },
            });
            if (usersToNotify.length > 0) {
                await this.prisma.notification.createMany({
                    data: usersToNotify.map(u => ({
                        userId: u.id,
                        title: `📅 Novo Evento Escolar — ${dto.title}`,
                        description: `A escola publicou um novo evento: "${dto.title}" agendado para ${dateFormatted}.${dto.location ? ` Local: ${dto.location}.` : ''}`,
                        institutionId,
                    })),
                });
            }
        }
        catch (e) {
            console.warn('Failed to send event notifications:', e);
        }
        return createdEvent;
    }
};
exports.CreateEventUseCase = CreateEventUseCase;
exports.CreateEventUseCase = CreateEventUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(event_repository_interface_1.IEventRepository)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], CreateEventUseCase);
//# sourceMappingURL=create-event.use-case.js.map