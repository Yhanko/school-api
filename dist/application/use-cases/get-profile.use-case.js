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
exports.GetProfileUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_entity_1 = require("../../domain/entities/user.entity");
let GetProfileUseCase = class GetProfileUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                institutionId: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        switch (user.role) {
            case user_entity_1.Role.STUDENT:
                return this.getStudentProfile(userId, user);
            case user_entity_1.Role.PARENT:
                return this.getParentProfile(userId, user);
            case user_entity_1.Role.TEACHER:
                return this.getTeacherProfile(userId, user);
            case user_entity_1.Role.ADMIN:
            case user_entity_1.Role.SUPER_ADMIN:
            case user_entity_1.Role.SECRETARY:
                return this.getAdminProfile(userId, user);
            default:
                return user;
        }
    }
    async getStudentProfile(userId, baseUser) {
        const classes = await this.prisma.class.findMany({
            where: {
                students: {
                    some: { id: userId },
                },
            },
        });
        const grades = await this.prisma.grade.findMany({
            where: { studentId: userId },
            include: { subject: true },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        const attendance = await this.prisma.attendance.findMany({
            where: { studentId: userId },
            include: { subject: true },
            orderBy: { date: 'desc' },
            take: 10,
        });
        return {
            ...baseUser,
            classes,
            recentGrades: grades,
            recentAttendance: attendance,
        };
    }
    async getParentProfile(userId, baseUser) {
        const children = await this.prisma.user.findMany({
            where: {
                parentId: userId,
                role: user_entity_1.Role.STUDENT,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        const childrenWithDetails = await Promise.all(children.map(async (child) => {
            const childClasses = await this.prisma.class.findMany({
                where: { students: { some: { id: child.id } } },
            });
            return {
                ...child,
                classes: childClasses,
            };
        }));
        return {
            ...baseUser,
            children: childrenWithDetails,
        };
    }
    async getTeacherProfile(userId, baseUser) {
        const schedules = await this.prisma.schedule.findMany({
            where: { teacherId: userId },
            include: {
                class: true,
                subject: true,
                room: true,
            },
        });
        const uniqueClasses = Array.from(new Map(schedules.map((s) => [s.classId, s.class])).values());
        const uniqueSubjects = Array.from(new Map(schedules.map((s) => [s.subjectId, s.subject])).values());
        return {
            ...baseUser,
            teachingClasses: uniqueClasses,
            teachingSubjects: uniqueSubjects,
            schedules,
        };
    }
    async getAdminProfile(userId, baseUser) {
        if (!baseUser.institutionId) {
            return baseUser;
        }
        const totalStudents = await this.prisma.user.count({
            where: { institutionId: baseUser.institutionId, role: user_entity_1.Role.STUDENT },
        });
        const totalTeachers = await this.prisma.user.count({
            where: { institutionId: baseUser.institutionId, role: user_entity_1.Role.TEACHER },
        });
        const institution = await this.prisma.institution.findUnique({
            where: { id: baseUser.institutionId },
        });
        return {
            ...baseUser,
            institution,
            stats: {
                totalStudents,
                totalTeachers,
            },
        };
    }
};
exports.GetProfileUseCase = GetProfileUseCase;
exports.GetProfileUseCase = GetProfileUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GetProfileUseCase);
//# sourceMappingURL=get-profile.use-case.js.map