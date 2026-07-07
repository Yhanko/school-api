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
exports.CreateClassUseCase = void 0;
const common_1 = require("@nestjs/common");
const class_repository_interface_1 = require("../../domain/repositories/class.repository.interface");
const institution_repository_interface_1 = require("../../domain/repositories/institution.repository.interface");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const class_entity_1 = require("../../domain/entities/class.entity");
const user_entity_1 = require("../../domain/entities/user.entity");
let CreateClassUseCase = class CreateClassUseCase {
    classRepository;
    institutionRepository;
    userRepository;
    constructor(classRepository, institutionRepository, userRepository) {
        this.classRepository = classRepository;
        this.institutionRepository = institutionRepository;
        this.userRepository = userRepository;
    }
    async execute(dto, institutionId) {
        if (!institutionId) {
            throw new common_1.BadRequestException('Institution ID is required from the logged in user');
        }
        const institution = await this.institutionRepository.findById(institutionId);
        if (!institution) {
            throw new common_1.NotFoundException('Institution not found');
        }
        if (dto.teacherIds && dto.teacherIds.length > 0) {
            for (const teacherId of dto.teacherIds) {
                const teacher = await this.userRepository.findById(teacherId);
                if (!teacher) {
                    throw new common_1.NotFoundException(`Teacher with ID ${teacherId} not found`);
                }
                if (teacher.institutionId !== institutionId) {
                    throw new common_1.BadRequestException(`Teacher ${teacherId} does not belong to your institution`);
                }
                if (teacher.role !== user_entity_1.Role.TEACHER) {
                    throw new common_1.BadRequestException(`User ${teacherId} is not a Teacher`);
                }
            }
        }
        const classEntity = new class_entity_1.ClassEntity('', dto.name, dto.period, dto.academicLevel, dto.room, dto.capacity, institutionId);
        return this.classRepository.create(classEntity, dto.teacherIds);
    }
    async executeGetByInstitution(institutionId) {
        return this.classRepository.findByInstitution(institutionId);
    }
    async executeGetByTeacher(teacherId, institutionId) {
        const all = await this.classRepository.findByInstitution(institutionId);
        return all.filter((c) => c.teachers?.some((t) => t.id === teacherId));
    }
    async executeGetById(id) {
        return this.classRepository.findById(id);
    }
};
exports.CreateClassUseCase = CreateClassUseCase;
exports.CreateClassUseCase = CreateClassUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(class_repository_interface_1.IClassRepository)),
    __param(1, (0, common_1.Inject)(institution_repository_interface_1.IInstitutionRepository)),
    __param(2, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateClassUseCase);
//# sourceMappingURL=create-class.use-case.js.map