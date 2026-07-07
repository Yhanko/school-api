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
exports.PrismaGradeRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const grade_entity_1 = require("../../domain/entities/grade.entity");
let PrismaGradeRepository = class PrismaGradeRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new grade_entity_1.GradeEntity(model.id, model.studentId, model.subjectId, model.classId, model.term, model.value, model.teacherId, model.institutionId, model.createdAt, model.updatedAt);
    }
    async create(grade) {
        const created = await this.prisma.grade.create({
            data: {
                studentId: grade.studentId,
                subjectId: grade.subjectId,
                classId: grade.classId,
                term: grade.term,
                value: grade.value,
                teacherId: grade.teacherId,
                institutionId: grade.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findByStudentAndClass(studentId, classId) {
        const grades = await this.prisma.grade.findMany({
            where: { studentId, classId },
            include: {
                subject: { select: { name: true } },
                teacher: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return grades.map((g) => {
            const entity = this.mapToEntity(g);
            entity.subjectName = g.subject.name;
            entity.teacherName = g.teacher.name;
            return entity;
        });
    }
    async findById(id) {
        const grade = await this.prisma.grade.findUnique({
            where: { id },
        });
        return grade ? this.mapToEntity(grade) : null;
    }
    async update(id, data) {
        const updated = await this.prisma.grade.update({
            where: { id },
            data: {
                value: data.value,
                term: data.term,
            },
        });
        return this.mapToEntity(updated);
    }
    async delete(id) {
        await this.prisma.grade.delete({
            where: { id },
        });
    }
};
exports.PrismaGradeRepository = PrismaGradeRepository;
exports.PrismaGradeRepository = PrismaGradeRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaGradeRepository);
//# sourceMappingURL=prisma-grade.repository.js.map