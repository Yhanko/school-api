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
exports.MarkAttendanceUseCase = void 0;
const common_1 = require("@nestjs/common");
const attendance_repository_interface_1 = require("../../domain/repositories/attendance.repository.interface");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const attendance_entity_1 = require("../../domain/entities/attendance.entity");
const user_entity_1 = require("../../domain/entities/user.entity");
const prisma_service_1 = require("../../prisma/prisma.service");
let MarkAttendanceUseCase = class MarkAttendanceUseCase {
    attendanceRepository;
    userRepository;
    prisma;
    constructor(attendanceRepository, userRepository, prisma) {
        this.attendanceRepository = attendanceRepository;
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
        const attendanceEntity = new attendance_entity_1.AttendanceEntity('', dto.studentId, dto.classId, new Date(dto.date), dto.status, teacherId, institutionId, dto.subjectId);
        const result = await this.attendanceRepository.create(attendanceEntity);
        if (dto.status === 'absent') {
            const lastAbsences = await this.prisma.attendance.findMany({
                where: { studentId: dto.studentId, subjectId: dto.subjectId },
                orderBy: { date: 'desc' },
                take: 3,
            });
            const allAbsent = lastAbsences.every(a => a.status === 'absent');
            if (lastAbsences.length === 3 && allAbsent) {
                const subject = dto.subjectId
                    ? await this.prisma.subject.findUnique({ where: { id: dto.subjectId }, select: { name: true } })
                    : null;
                const subjectName = subject?.name || 'uma disciplina';
                const notificationsToCreate = [];
                const admin = await this.prisma.user.findFirst({
                    where: { institutionId, role: user_entity_1.Role.ADMIN }
                });
                if (admin) {
                    notificationsToCreate.push({
                        userId: admin.id,
                        title: '⚠️ Alerta de Faltas (Risco Escolar)',
                        description: `O aluno ${student.name} atingiu 3 faltas consecutivas em ${subjectName}. Recomenda-se contactar o encarregado.`,
                        institutionId,
                    });
                }
                const studentWithParent = await this.prisma.user.findUnique({
                    where: { id: dto.studentId },
                    select: { parentId: true },
                });
                if (studentWithParent?.parentId) {
                    notificationsToCreate.push({
                        userId: studentWithParent.parentId,
                        title: '⚠️ Alerta de Faltas do seu Educando',
                        description: `O seu educando ${student.name} acumulou 3 faltas consecutivas em ${subjectName}. Por favor, entre em contacto com a escola.`,
                        institutionId,
                    });
                }
                const secretaries = await this.prisma.user.findMany({
                    where: { institutionId, role: user_entity_1.Role.SECRETARY },
                    select: { id: true },
                });
                for (const sec of secretaries) {
                    notificationsToCreate.push({
                        userId: sec.id,
                        title: '⚠️ Alerta de Faltas — Ação Requerida',
                        description: `O aluno ${student.name} tem 3 faltas consecutivas em ${subjectName}. Verifique a situação.`,
                        institutionId,
                    });
                }
                if (notificationsToCreate.length > 0) {
                    await this.prisma.notification.createMany({ data: notificationsToCreate });
                }
            }
        }
        return result;
    }
};
exports.MarkAttendanceUseCase = MarkAttendanceUseCase;
exports.MarkAttendanceUseCase = MarkAttendanceUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(attendance_repository_interface_1.IAttendanceRepository)),
    __param(1, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, prisma_service_1.PrismaService])
], MarkAttendanceUseCase);
//# sourceMappingURL=mark-attendance.use-case.js.map