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
exports.PrismaInstitutionRepository = void 0;
const common_1 = require("@nestjs/common");
const institution_entity_1 = require("../../domain/entities/institution.entity");
const prisma_service_1 = require("../../prisma/prisma.service");
let PrismaInstitutionRepository = class PrismaInstitutionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const institution = await this.prisma.institution.findUnique({ where: { id } });
        if (!institution)
            return null;
        return new institution_entity_1.InstitutionEntity(institution.id, institution.name, institution.email, institution.address, institution.createdAt, institution.updatedAt);
    }
    async create(institution) {
        const created = await this.prisma.institution.create({
            data: {
                name: institution.name,
                email: institution.email,
                address: institution.address,
            },
        });
        return new institution_entity_1.InstitutionEntity(created.id, created.name, created.email, created.address, created.createdAt, created.updatedAt);
    }
};
exports.PrismaInstitutionRepository = PrismaInstitutionRepository;
exports.PrismaInstitutionRepository = PrismaInstitutionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaInstitutionRepository);
//# sourceMappingURL=prisma-institution.repository.js.map