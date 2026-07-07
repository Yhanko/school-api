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
exports.EnrollStudentUseCase = void 0;
const common_1 = require("@nestjs/common");
const class_repository_interface_1 = require("../../domain/repositories/class.repository.interface");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const user_entity_1 = require("../../domain/entities/user.entity");
const prisma_service_1 = require("../../prisma/prisma.service");
let EnrollStudentUseCase = class EnrollStudentUseCase {
    classRepository;
    userRepository;
    prisma;
    constructor(classRepository, userRepository, prisma) {
        this.classRepository = classRepository;
        this.userRepository = userRepository;
        this.prisma = prisma;
    }
    async execute(classId, studentId, institutionId) {
        const classEntity = await this.classRepository.findById(classId);
        if (!classEntity) {
            throw new common_1.NotFoundException('Class not found');
        }
        if (classEntity.institutionId !== institutionId) {
            throw new common_1.BadRequestException('Class does not belong to your institution');
        }
        const student = await this.userRepository.findById(studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (student.institutionId !== institutionId) {
            throw new common_1.BadRequestException('Student does not belong to your institution');
        }
        if (student.role !== user_entity_1.Role.STUDENT) {
            throw new common_1.BadRequestException('User is not a student');
        }
        const currentStudentsCount = await this.prisma.user.count({
            where: {
                enrolledClasses: {
                    some: {
                        id: classId
                    }
                }
            }
        });
        if (currentStudentsCount >= classEntity.capacity) {
            throw new common_1.BadRequestException(`Class is full. Maximum capacity is ${classEntity.capacity}`);
        }
        await this.prisma.class.update({
            where: { id: classId },
            data: {
                students: {
                    connect: { id: studentId }
                }
            }
        });
    }
};
exports.EnrollStudentUseCase = EnrollStudentUseCase;
exports.EnrollStudentUseCase = EnrollStudentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(class_repository_interface_1.IClassRepository)),
    __param(1, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, prisma_service_1.PrismaService])
], EnrollStudentUseCase);
//# sourceMappingURL=enroll-student.use-case.js.map