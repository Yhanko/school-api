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
exports.PrismaEventRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const event_entity_1 = require("../../domain/entities/event.entity");
let PrismaEventRepository = class PrismaEventRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new event_entity_1.EventEntity(model.id, model.title, model.description, model.date, model.type, model.organizer, model.location, model.participants, model.institutionId, model.createdAt, model.updatedAt);
    }
    async create(event) {
        const created = await this.prisma.event.create({
            data: {
                title: event.title,
                description: event.description,
                date: event.date,
                type: event.type,
                organizer: event.organizer,
                location: event.location,
                participants: event.participants,
                institutionId: event.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findAllByInstitution(institutionId) {
        const events = await this.prisma.event.findMany({
            where: { institutionId },
            orderBy: { date: 'asc' },
        });
        return events.map((e) => this.mapToEntity(e));
    }
    async findById(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });
        return event ? this.mapToEntity(event) : null;
    }
    async update(id, data) {
        const updated = await this.prisma.event.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                type: data.type,
                organizer: data.organizer,
                location: data.location,
                participants: data.participants,
            },
        });
        return this.mapToEntity(updated);
    }
    async delete(id) {
        await this.prisma.event.delete({
            where: { id },
        });
    }
};
exports.PrismaEventRepository = PrismaEventRepository;
exports.PrismaEventRepository = PrismaEventRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaEventRepository);
//# sourceMappingURL=prisma-event.repository.js.map