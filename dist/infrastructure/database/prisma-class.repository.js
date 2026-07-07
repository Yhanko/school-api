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
exports.PrismaClassRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const class_entity_1 = require("../../domain/entities/class.entity");
const user_entity_1 = require("../../domain/entities/user.entity");
let PrismaClassRepository = class PrismaClassRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        const teachers = model.teachers?.map((t) => new user_entity_1.UserEntity(t.id, t.email, t.name, t.role, undefined, t.institutionId));
        return new class_entity_1.ClassEntity(model.id, model.name, model.period, model.academicLevel, model.room, model.capacity, model.institutionId, teachers, model.createdAt, model.updatedAt);
    }
    async create(classData, teacherIds) {
        const created = await this.prisma.class.create({
            data: {
                name: classData.name,
                period: classData.period,
                academicLevel: classData.academicLevel,
                roomName: 'Default', roomId: classData.room,
                capacity: classData.capacity,
                institutionId: classData.institutionId,
                teachers: {
                    connect: teacherIds.map((id) => ({ id })),
                },
            },
            include: {
                teachers: true,
            },
        });
        return this.mapToEntity(created);
    }
    async findById(id) {
        const classModel = await this.prisma.class.findUnique({
            where: { id },
            include: {
                teachers: true,
            },
        });
        return classModel ? this.mapToEntity(classModel) : null;
    }
    async findByInstitution(institutionId) {
        const classes = await this.prisma.class.findMany({
            where: { institutionId },
            include: {
                teachers: true,
            },
        });
        return classes.map((c) => this.mapToEntity(c));
    }
};
exports.PrismaClassRepository = PrismaClassRepository;
exports.PrismaClassRepository = PrismaClassRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaClassRepository);
//# sourceMappingURL=prisma-class.repository.js.map