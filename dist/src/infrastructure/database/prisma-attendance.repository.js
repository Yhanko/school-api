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
exports.PrismaAttendanceRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const attendance_entity_1 = require("../../domain/entities/attendance.entity");
let PrismaAttendanceRepository = class PrismaAttendanceRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new attendance_entity_1.AttendanceEntity(model.id, model.studentId, model.classId, model.date, model.status, model.teacherId, model.institutionId, model.subjectId, model.createdAt, model.updatedAt);
    }
    async create(attendance) {
        const created = await this.prisma.attendance.create({
            data: {
                studentId: attendance.studentId,
                classId: attendance.classId,
                subjectId: attendance.subjectId,
                date: attendance.date,
                status: attendance.status,
                teacherId: attendance.teacherId,
                institutionId: attendance.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findByStudentAndClass(studentId, classId) {
        const attendances = await this.prisma.attendance.findMany({
            where: { studentId, classId },
            orderBy: { date: 'desc' },
        });
        return attendances.map((a) => this.mapToEntity(a));
    }
};
exports.PrismaAttendanceRepository = PrismaAttendanceRepository;
exports.PrismaAttendanceRepository = PrismaAttendanceRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaAttendanceRepository);
//# sourceMappingURL=prisma-attendance.repository.js.map