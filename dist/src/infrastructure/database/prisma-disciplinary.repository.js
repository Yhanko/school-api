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
exports.PrismaDisciplinaryRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const disciplinary_entity_1 = require("../../domain/entities/disciplinary.entity");
let PrismaDisciplinaryRepository = class PrismaDisciplinaryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new disciplinary_entity_1.DisciplinaryEntity(model.id, model.studentId, model.type, model.severity, model.status, model.description, model.date, model.reportedById, model.institutionId, model.createdAt, model.updatedAt);
    }
    async create(record) {
        const created = await this.prisma.disciplinaryRecord.create({
            data: {
                studentId: record.studentId,
                type: record.type,
                severity: record.severity,
                status: record.status,
                description: record.description,
                date: record.date,
                reportedById: record.reportedById,
                institutionId: record.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findAll(institutionId, studentId) {
        const where = { institutionId };
        if (studentId) {
            where.studentId = studentId;
        }
        const records = await this.prisma.disciplinaryRecord.findMany({
            where,
            orderBy: { date: 'desc' },
            include: {
                student: { select: { id: true, name: true } },
                reportedBy: { select: { id: true, name: true } },
            },
        });
        return records.map((r) => this.mapToEntity(r));
    }
    async findById(id) {
        const record = await this.prisma.disciplinaryRecord.findUnique({ where: { id } });
        if (!record)
            return null;
        return this.mapToEntity(record);
    }
    async updateStatus(id, status) {
        const updated = await this.prisma.disciplinaryRecord.update({
            where: { id },
            data: { status: status },
        });
        return this.mapToEntity(updated);
    }
    async delete(id) {
        await this.prisma.disciplinaryRecord.delete({ where: { id } });
    }
};
exports.PrismaDisciplinaryRepository = PrismaDisciplinaryRepository;
exports.PrismaDisciplinaryRepository = PrismaDisciplinaryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaDisciplinaryRepository);
//# sourceMappingURL=prisma-disciplinary.repository.js.map