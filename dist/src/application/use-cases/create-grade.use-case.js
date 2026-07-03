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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGradeUseCase = void 0;
const common_1 = require("@nestjs/common");
const grade_repository_interface_1 = require("../../domain/repositories/grade.repository.interface");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const grade_entity_1 = require("../../domain/entities/grade.entity");
const user_entity_1 = require("../../domain/entities/user.entity");
const prisma_service_1 = require("../../prisma/prisma.service");
let CreateGradeUseCase = class CreateGradeUseCase {
    gradeRepository;
    userRepository;
    prisma;
    constructor(gradeRepository, userRepository, prisma) {
        this.gradeRepository = gradeRepository;
        this.userRepository = userRepository;
        this.prisma = prisma;
    }
    async execute(dto, teacherId, institutionId) {
        const student = await this.userRepository.findById(dto.studentId);
        if (!student || student.role !== user_entity_1.Role.STUDENT) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (student.institutionId !== institutionId) {
            throw new common_1.BadRequestException('Student does not belong to your institution');
        }
        const isEnrolled = await this.prisma.class.count({
            where: {
                id: dto.classId,
                institutionId: institutionId,
                students: { some: { id: dto.studentId } }
            }
        });
        if (isEnrolled === 0) {
            throw new common_1.BadRequestException('Student is not enrolled in this class');
        }
        const gradeEntity = new grade_entity_1.GradeEntity('', dto.studentId, dto.subjectId, dto.classId, dto.term, dto.value, teacherId, institutionId);
        const result = await this.gradeRepository.create(gradeEntity);
        try {
            const subject = dto.subjectId
                ? await this.prisma.subject.findUnique({ where: { id: dto.subjectId }, select: { name: true } })
                : null;
            const subjectName = subject?.name || 'uma disciplina';
            const termLabel = dto.term === 'first' ? '1º Trimestre' : dto.term === 'second' ? '2º Trimestre' : '3º Trimestre';
            const gradeEmoji = dto.value >= 14 ? '🌟' : dto.value >= 10 ? '📘' : '⚠️';
            const studentWithParent = await this.prisma.user.findUnique({
                where: { id: dto.studentId },
                select: { parentId: true },
            });
            const notificationsToCreate = [];
            notificationsToCreate.push({
                userId: dto.studentId,
                title: `${gradeEmoji} Nova Nota Lançada — ${subjectName}`,
                description: `Recebeste a nota ${dto.value} valores em ${subjectName} (${termLabel}). ${dto.value >= 10 ? 'Bom trabalho!' : 'Recomenda-se mais estudo nesta disciplina.'}`,
                institutionId,
            });
            if (studentWithParent?.parentId) {
                notificationsToCreate.push({
                    userId: studentWithParent.parentId,
                    title: `${gradeEmoji} Nota do seu Educando — ${subjectName}`,
                    description: `O seu educando ${student.name} recebeu a nota ${dto.value} valores em ${subjectName} (${termLabel}).${dto.value < 10 ? ' Esta nota está abaixo do mínimo. Recomenda-se acompanhamento extra.' : ''}`,
                    institutionId,
                });
            }
            if (dto.value < 10) {
                const allGrades = await this.prisma.grade.findMany({
                    where: { studentId: dto.studentId, subjectId: dto.subjectId },
                });
                const avg = allGrades.reduce((a, b) => a + b.value, 0) / allGrades.length;
                if (avg < 10) {
                    const admin = await this.prisma.user.findFirst({
                        where: { institutionId, role: user_entity_1.Role.ADMIN }
                    });
                    if (admin) {
                        notificationsToCreate.push({
                            userId: admin.id,
                            title: '🚨 Alerta Académico — Risco de Reprovação',
                            description: `A média do aluno ${student.name} em ${subjectName} caiu para ${avg.toFixed(1)} valores. Recomenda-se acompanhamento extra urgente.`,
                            institutionId,
                        });
                    }
                }
            }
            if (notificationsToCreate.length > 0) {
                await this.prisma.notification.createMany({ data: notificationsToCreate });
            }
        }
        catch (e) {
            console.warn('Failed to send grade notification:', e);
        }
        return result;
    }
};
exports.CreateGradeUseCase = CreateGradeUseCase;
exports.CreateGradeUseCase = CreateGradeUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(grade_repository_interface_1.IGradeRepository)),
    __param(1, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, prisma_service_1.PrismaService])
], CreateGradeUseCase);
//# sourceMappingURL=create-grade.use-case.js.map