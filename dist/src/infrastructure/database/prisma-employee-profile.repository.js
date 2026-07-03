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
exports.PrismaEmployeeProfileRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const employee_profile_entity_1 = require("../../domain/entities/employee-profile.entity");
let PrismaEmployeeProfileRepository = class PrismaEmployeeProfileRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new employee_profile_entity_1.EmployeeProfileEntity(model.id, model.userId, model.phone ?? undefined, model.address ?? undefined, model.photoUrl ?? undefined, model.university ?? undefined, model.degree ?? undefined, model.educationPeriod ?? undefined, model.city ?? undefined, model.cvUrl ?? undefined, model.biUrl ?? undefined);
    }
    async create(profile) {
        const data = {
            userId: profile.userId,
            phone: profile.phone,
            address: profile.address,
            photoUrl: profile.photoUrl,
            university: profile.university,
            degree: profile.degree,
            educationPeriod: profile.educationPeriod,
            city: profile.city,
            cvUrl: profile.cvUrl,
            biUrl: profile.biUrl,
        };
        const createdProfile = await this.prisma.employeeProfile.create({ data });
        return this.mapToEntity(createdProfile);
    }
    async findByUserId(userId) {
        const profile = await this.prisma.employeeProfile.findUnique({
            where: { userId },
        });
        return profile ? this.mapToEntity(profile) : null;
    }
    async update(userId, data) {
        const updated = await this.prisma.employeeProfile.update({
            where: { userId },
            data: {
                phone: data.phone,
                address: data.address,
                photoUrl: data.photoUrl,
                university: data.university,
                degree: data.degree,
                educationPeriod: data.educationPeriod,
                city: data.city,
                cvUrl: data.cvUrl,
                biUrl: data.biUrl,
            },
        });
        return this.mapToEntity(updated);
    }
};
exports.PrismaEmployeeProfileRepository = PrismaEmployeeProfileRepository;
exports.PrismaEmployeeProfileRepository = PrismaEmployeeProfileRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaEmployeeProfileRepository);
//# sourceMappingURL=prisma-employee-profile.repository.js.map