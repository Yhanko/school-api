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
exports.PrismaScheduleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const schedule_entity_1 = require("../../domain/entities/schedule.entity");
let PrismaScheduleRepository = class PrismaScheduleRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new schedule_entity_1.ScheduleEntity(model.id, model.classId, model.subjectId, model.teacherId, model.roomId, model.dayOfWeek, model.startTime, model.endTime, model.institutionId, model.createdAt, model.updatedAt);
    }
    async create(schedule) {
        const created = await this.prisma.schedule.create({
            data: {
                classId: schedule.classId,
                subjectId: schedule.subjectId,
                teacherId: schedule.teacherId,
                roomId: schedule.roomId,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                institutionId: schedule.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findByClass(classId) {
        const schedules = await this.prisma.schedule.findMany({
            where: { classId },
            orderBy: [
                { dayOfWeek: 'asc' },
                { startTime: 'asc' }
            ]
        });
        return schedules.map((s) => this.mapToEntity(s));
    }
};
exports.PrismaScheduleRepository = PrismaScheduleRepository;
exports.PrismaScheduleRepository = PrismaScheduleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaScheduleRepository);
//# sourceMappingURL=prisma-schedule.repository.js.map