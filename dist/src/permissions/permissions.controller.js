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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const get_users_permissions_use_case_1 = require("../application/use-cases/get-users-permissions.use-case");
const update_user_permissions_use_case_1 = require("../application/use-cases/update-user-permissions.use-case");
const update_user_permissions_dto_1 = require("../presentation/dtos/update-user-permissions.dto");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
let PermissionsController = class PermissionsController {
    getUsersPermissionsUseCase;
    updateUserPermissionsUseCase;
    constructor(getUsersPermissionsUseCase, updateUserPermissionsUseCase) {
        this.getUsersPermissionsUseCase = getUsersPermissionsUseCase;
        this.updateUserPermissionsUseCase = updateUserPermissionsUseCase;
    }
    getUsersPermissions(user) {
        return this.getUsersPermissionsUseCase.execute(user.institutionId);
    }
    updateUserPermissions(userId, dto) {
        return this.updateUserPermissionsUseCase.execute(userId, dto);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN, user_entity_1.Role.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "getUsersPermissions", null);
__decorate([
    (0, common_1.Patch)(':userId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN, user_entity_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_permissions_dto_1.UpdateUserPermissionsDto]),
    __metadata("design:returntype", void 0)
], PermissionsController.prototype, "updateUserPermissions", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, common_1.Controller)('permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [get_users_permissions_use_case_1.GetUsersPermissionsUseCase,
        update_user_permissions_use_case_1.UpdateUserPermissionsUseCase])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map