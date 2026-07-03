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
exports.ClassesController = void 0;
const common_1 = require("@nestjs/common");
const create_class_dto_1 = require("../presentation/dtos/create-class.dto");
const create_class_use_case_1 = require("../application/use-cases/create-class.use-case");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
const enroll_student_use_case_1 = require("../application/use-cases/enroll-student.use-case");
let ClassesController = class ClassesController {
    createClassUseCase;
    enrollStudentUseCase;
    constructor(createClassUseCase, enrollStudentUseCase) {
        this.createClassUseCase = createClassUseCase;
        this.enrollStudentUseCase = enrollStudentUseCase;
    }
    getClasses(user) {
        return this.createClassUseCase.executeGetByInstitution(user.institutionId);
    }
    getClassesByTeacher(teacherId, user) {
        return this.createClassUseCase.executeGetByTeacher(teacherId, user.institutionId);
    }
    getClassById(id) {
        return this.createClassUseCase.executeGetById(id);
    }
    createClass(createClassDto, user) {
        return this.createClassUseCase.execute(createClassDto, user.institutionId);
    }
    enrollStudent(classId, studentId, user) {
        return this.enrollStudentUseCase.execute(classId, studentId, user.institutionId);
    }
};
exports.ClassesController = ClassesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.TEACHER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getClasses", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.TEACHER),
    __param(0, (0, common_1.Param)('teacherId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getClassesByTeacher", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.TEACHER, user_entity_1.Role.STUDENT, user_entity_1.Role.PARENT),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "getClassById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_class_dto_1.CreateClassDto, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "createClass", null);
__decorate([
    (0, common_1.Post)(':id/enroll/:studentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ClassesController.prototype, "enrollStudent", null);
exports.ClassesController = ClassesController = __decorate([
    (0, common_1.Controller)('classes'),
    __metadata("design:paramtypes", [create_class_use_case_1.CreateClassUseCase,
        enroll_student_use_case_1.EnrollStudentUseCase])
], ClassesController);
//# sourceMappingURL=classes.controller.js.map