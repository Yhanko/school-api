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
exports.PrismaRegulationRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const regulation_entity_1 = require("../../domain/entities/regulation.entity");
let PrismaRegulationRepository = class PrismaRegulationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new regulation_entity_1.RegulationEntity(model.id, model.title, model.description, model.content, model.fileUrl, model.status, model.institutionId, model.authorId, model.createdAt, model.updatedAt);
    }
    async create(regulation) {
        const created = await this.prisma.regulation.create({
            data: {
                title: regulation.title,
                description: regulation.description,
                content: regulation.content,
                fileUrl: regulation.fileUrl,
                status: regulation.status,
                institutionId: regulation.institutionId,
                authorId: regulation.authorId,
            },
        });
        return this.mapToEntity(created);
    }
    async findAllByInstitution(institutionId, status) {
        const whereClause = { institutionId };
        if (status) {
            whereClause.status = status;
        }
        const regulations = await this.prisma.regulation.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
        return regulations.map((r) => this.mapToEntity(r));
    }
    async findById(id) {
        const regulation = await this.prisma.regulation.findUnique({ where: { id } });
        if (!regulation)
            return null;
        return this.mapToEntity(regulation);
    }
    async updateStatus(id, status) {
        const updated = await this.prisma.regulation.update({
            where: { id },
            data: { status: status },
        });
        return this.mapToEntity(updated);
    }
    async delete(id) {
        await this.prisma.regulation.delete({ where: { id } });
    }
};
exports.PrismaRegulationRepository = PrismaRegulationRepository;
exports.PrismaRegulationRepository = PrismaRegulationRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaRegulationRepository);
//# sourceMappingURL=prisma-regulation.repository.js.map