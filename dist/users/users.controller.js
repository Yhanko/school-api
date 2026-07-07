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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const create_admin_use_case_1 = require("../application/use-cases/create-admin.use-case");
const create_student_use_case_1 = require("../application/use-cases/create-student.use-case");
const create_employee_use_case_1 = require("../application/use-cases/create-employee.use-case");
const get_profile_use_case_1 = require("../application/use-cases/get-profile.use-case");
const create_admin_dto_1 = require("../presentation/dtos/create-admin.dto");
const create_student_dto_1 = require("../presentation/dtos/create-student.dto");
const create_employee_dto_1 = require("../presentation/dtos/create-employee.dto");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
let UsersController = class UsersController {
    usersService;
    createAdminUseCase;
    createStudentUseCase;
    createEmployeeUseCase;
    getProfileUseCase;
    constructor(usersService, createAdminUseCase, createStudentUseCase, createEmployeeUseCase, getProfileUseCase) {
        this.usersService = usersService;
        this.createAdminUseCase = createAdminUseCase;
        this.createStudentUseCase = createStudentUseCase;
        this.createEmployeeUseCase = createEmployeeUseCase;
        this.getProfileUseCase = getProfileUseCase;
    }
    getProfile(user) {
        return this.getProfileUseCase.execute(user.sub);
    }
    updateMyProfile(user, updateData) {
        return this.usersService.update(user.sub, updateData);
    }
    changeMyPassword(user, body) {
        return this.usersService.changePassword(user.sub, body.currentPassword, body.newPassword);
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    createAdmin(createAdminDto) {
        return this.createAdminUseCase.execute(createAdminDto);
    }
    createEmployee(createEmployeeDto, user) {
        return this.createEmployeeUseCase.execute(createEmployeeDto, user.institutionId);
    }
    createStudent(createStudentDto, user) {
        return this.createStudentUseCase.execute(createStudentDto, user.institutionId);
    }
    findAll(user, role) {
        return this.usersService.findAll(user.institutionId, role);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, updateData) {
        return this.usersService.update(id, updateData);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMyProfile", null);
__decorate([
    (0, common_1.Patch)('me/password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changeMyPassword", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createAdmin", null);
__decorate([
    (0, common_1.Post)('employee'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_employee_dto_1.CreateEmployeeDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Post)('student'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createStudent", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        create_admin_use_case_1.CreateAdminUseCase,
        create_student_use_case_1.CreateStudentUseCase,
        create_employee_use_case_1.CreateEmployeeUseCase,
        get_profile_use_case_1.GetProfileUseCase])
], UsersController);
//# sourceMappingURL=users.controller.js.map