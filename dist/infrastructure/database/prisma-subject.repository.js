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
exports.PrismaSubjectRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const subject_entity_1 = require("../../domain/entities/subject.entity");
let PrismaSubjectRepository = class PrismaSubjectRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new subject_entity_1.SubjectEntity(model.id, model.name, model.institutionId, model.code, model.createdAt, model.updatedAt);
    }
    async create(subject) {
        const created = await this.prisma.subject.create({
            data: {
                name: subject.name,
                code: subject.code,
                institutionId: subject.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findAllByInstitution(institutionId) {
        const subjects = await this.prisma.subject.findMany({
            where: { institutionId },
            orderBy: { name: 'asc' },
        });
        return subjects.map((s) => this.mapToEntity(s));
    }
    async findById(id) {
        const subject = await this.prisma.subject.findUnique({
            where: { id },
        });
        return subject ? this.mapToEntity(subject) : null;
    }
    async findByStudent(studentId) {
        const subjects = await this.prisma.subject.findMany({
            where: {
                classes: {
                    some: {
                        students: {
                            some: { id: studentId },
                        },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        return subjects.map((s) => this.mapToEntity(s));
    }
    async delete(id) {
        await this.prisma.subject.delete({
            where: { id },
        });
    }
};
exports.PrismaSubjectRepository = PrismaSubjectRepository;
exports.PrismaSubjectRepository = PrismaSubjectRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaSubjectRepository);
//# sourceMappingURL=prisma-subject.repository.js.map