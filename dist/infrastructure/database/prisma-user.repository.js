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
exports.PrismaUserRepository = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../../domain/entities/user.entity");
const prisma_service_1 = require("../../prisma/prisma.service");
let PrismaUserRepository = class PrismaUserRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({ where: { email }, include: { employeeProfile: true } });
        if (!user)
            return null;
        const entity = new user_entity_1.UserEntity(user.id, user.email, user.name, user.role, user.password, user.institutionId, undefined, user.createdAt, user.updatedAt);
        entity.profile = user.employeeProfile;
        return entity;
    }
    async findById(id) {
        const user = await this.prisma.user.findUnique({ where: { id }, include: { employeeProfile: true } });
        if (!user)
            return null;
        const entity = new user_entity_1.UserEntity(user.id, user.email, user.name, user.role, user.password, user.institutionId, undefined, user.createdAt, user.updatedAt);
        entity.profile = user.employeeProfile;
        return entity;
    }
    async findByInstitution(institutionId) {
        const users = await this.prisma.user.findMany({ where: { institutionId }, include: { employeeProfile: true } });
        return users.map(user => {
            const entity = new user_entity_1.UserEntity(user.id, user.email, user.name, user.role, user.password, user.institutionId, undefined, user.createdAt, user.updatedAt);
            entity.profile = user.employeeProfile;
            return entity;
        });
    }
    async create(user) {
        const isSuperAdminOrAdmin = user.role === user_entity_1.Role.SUPER_ADMIN || user.role === user_entity_1.Role.ADMIN;
        const isTeacher = user.role === user_entity_1.Role.TEACHER;
        const isSecretary = user.role === user_entity_1.Role.SECRETARY;
        const created = await this.prisma.user.create({
            data: {
                email: user.email,
                password: user.password,
                name: user.name,
                role: user.role,
                institutionId: user.institutionId,
                userPermission: {
                    create: {
                        dashboard: isSuperAdminOrAdmin || isTeacher || isSecretary,
                        students: isSuperAdminOrAdmin || isTeacher || isSecretary,
                        teachers: isSuperAdminOrAdmin || isSecretary,
                        classes: isSuperAdminOrAdmin || isTeacher || isSecretary,
                        financial: isSuperAdminOrAdmin || isSecretary,
                        activities: isSuperAdminOrAdmin || isTeacher || isSecretary,
                        payments: isSuperAdminOrAdmin || isSecretary,
                        attendance: isSuperAdminOrAdmin || isTeacher || isSecretary,
                        discipline: isSuperAdminOrAdmin || isTeacher || isSecretary,
                        permissions: isSuperAdminOrAdmin,
                    }
                }
            },
        });
        return new user_entity_1.UserEntity(created.id, created.email, created.name, created.role, undefined, created.institutionId, undefined, created.createdAt, created.updatedAt);
    }
    async update(id, data) {
        const updateData = { ...data };
        delete updateData.id;
        if (updateData.profile) {
            updateData.employeeProfile = {
                upsert: {
                    create: updateData.profile,
                    update: updateData.profile
                }
            };
            delete updateData.profile;
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data: updateData,
            include: { employeeProfile: true }
        });
        const entity = new user_entity_1.UserEntity(updated.id, updated.email, updated.name, updated.role, undefined, updated.institutionId, undefined, updated.createdAt, updated.updatedAt);
        entity.profile = updated.employeeProfile;
        return entity;
    }
};
exports.PrismaUserRepository = PrismaUserRepository;
exports.PrismaUserRepository = PrismaUserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUserRepository);
//# sourceMappingURL=prisma-user.repository.js.map