"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const permissions_controller_1 = require("./permissions.controller");
const get_users_permissions_use_case_1 = require("../application/use-cases/get-users-permissions.use-case");
const update_user_permissions_use_case_1 = require("../application/use-cases/update-user-permissions.use-case");
const permission_repository_interface_1 = require("../domain/repositories/permission.repository.interface");
const prisma_permission_repository_1 = require("../infrastructure/database/prisma-permission.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let PermissionsModule = class PermissionsModule {
};
exports.PermissionsModule = PermissionsModule;
exports.PermissionsModule = PermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [permissions_controller_1.PermissionsController],
        providers: [
            get_users_permissions_use_case_1.GetUsersPermissionsUseCase,
            update_user_permissions_use_case_1.UpdateUserPermissionsUseCase,
            {
                provide: permission_repository_interface_1.IPermissionRepository,
                useClass: prisma_permission_repository_1.PrismaPermissionRepository,
            },
        ],
    })
], PermissionsModule);
//# sourceMappingURL=permissions.module.js.map