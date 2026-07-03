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
exports.PrismaPermissionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const permission_entity_1 = require("../../domain/entities/permission.entity");
let PrismaPermissionRepository = class PrismaPermissionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new permission_entity_1.PermissionEntity(model.id, model.userId, model.dashboard, model.students, model.teachers, model.classes, model.financial, model.activities, model.payments, model.attendance, model.discipline, model.permissions, model.createdAt, model.updatedAt);
    }
    async createDefault(userId, isSuperAdmin = false) {
        const created = await this.prisma.userPermission.create({
            data: {
                userId,
                dashboard: true,
                students: true,
                teachers: isSuperAdmin,
                classes: true,
                financial: isSuperAdmin,
                activities: true,
                payments: isSuperAdmin,
                attendance: true,
                discipline: isSuperAdmin,
                permissions: isSuperAdmin,
            },
        });
        return this.mapToEntity(created);
    }
    async findByUserId(userId) {
        const record = await this.prisma.userPermission.findUnique({ where: { userId } });
        if (!record)
            return null;
        return this.mapToEntity(record);
    }
    async findAllByInstitution(institutionId) {
        const users = await this.prisma.user.findMany({
            where: {
                institutionId,
                role: { in: ['ADMIN', 'SECRETARY', 'TEACHER'] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                userPermission: true,
            }
        });
        return users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: 'Ativo',
            permissions: u.userPermission || {
                dashboard: false,
                students: false,
                teachers: false,
                classes: false,
                financial: false,
                activities: false,
                payments: false,
                attendance: false,
                discipline: false,
                permissions: false,
            }
        }));
    }
    async updateByUserId(userId, permissions) {
        const data = { ...permissions };
        delete data.id;
        delete data.userId;
        delete data.createdAt;
        delete data.updatedAt;
        const updated = await this.prisma.userPermission.upsert({
            where: { userId },
            update: data,
            create: {
                userId,
                ...data,
            }
        });
        return this.mapToEntity(updated);
    }
};
exports.PrismaPermissionRepository = PrismaPermissionRepository;
exports.PrismaPermissionRepository = PrismaPermissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPermissionRepository);
//# sourceMappingURL=prisma-permission.repository.js.map