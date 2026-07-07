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
exports.GenerateAcademicReportUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_entity_1 = require("../../domain/entities/user.entity");
let GenerateAcademicReportUseCase = class GenerateAcademicReportUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(institutionId) {
        const totalStudents = await this.prisma.user.count({
            where: { institutionId, role: user_entity_1.Role.STUDENT },
        });
        const classes = await this.prisma.class.findMany({
            where: { institutionId },
            include: {
                _count: {
                    select: { students: true },
                },
            },
        });
        const grades = await this.prisma.grade.findMany({
            where: { institutionId },
        });
        let averageGrade = 0;
        if (grades.length > 0) {
            const sum = grades.reduce((acc, curr) => acc + curr.value, 0);
            averageGrade = sum / grades.length;
        }
        const attendances = await this.prisma.attendance.findMany({
            where: { institutionId },
        });
        let attendanceRate = 0;
        if (attendances.length > 0) {
            const presentCount = attendances.filter(a => a.status === 'present').length;
            attendanceRate = (presentCount / attendances.length) * 100;
        }
        const classData = classes.map(c => {
            return {
                classId: c.id,
                className: c.name,
                studentsCount: c._count.students,
            };
        });
        return {
            overview: {
                totalStudents,
                averageGrade: Number(averageGrade.toFixed(2)),
                attendanceRate: Number(attendanceRate.toFixed(2)),
            },
            classes: classData,
        };
    }
};
exports.GenerateAcademicReportUseCase = GenerateAcademicReportUseCase;
exports.GenerateAcademicReportUseCase = GenerateAcademicReportUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenerateAcademicReportUseCase);
//# sourceMappingURL=generate-academic-report.use-case.js.map