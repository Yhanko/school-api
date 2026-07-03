"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const institutions_module_1 = require("../institutions/institutions.module");
const create_admin_use_case_1 = require("../application/use-cases/create-admin.use-case");
const create_student_use_case_1 = require("../application/use-cases/create-student.use-case");
const create_employee_use_case_1 = require("../application/use-cases/create-employee.use-case");
const get_profile_use_case_1 = require("../application/use-cases/get-profile.use-case");
const prisma_user_repository_1 = require("../infrastructure/database/prisma-user.repository");
const bcrypt_hash_service_1 = require("../infrastructure/services/bcrypt-hash.service");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const hash_service_interface_1 = require("../application/interfaces/hash.service.interface");
const prisma_employee_profile_repository_1 = require("../infrastructure/database/prisma-employee-profile.repository");
const employee_profile_repository_interface_1 = require("../domain/repositories/employee-profile.repository.interface");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, institutions_module_1.InstitutionsModule],
        providers: [
            users_service_1.UsersService,
            create_admin_use_case_1.CreateAdminUseCase,
            create_student_use_case_1.CreateStudentUseCase,
            create_employee_use_case_1.CreateEmployeeUseCase,
            get_profile_use_case_1.GetProfileUseCase,
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
            {
                provide: employee_profile_repository_interface_1.IEmployeeProfileRepository,
                useClass: prisma_employee_profile_repository_1.PrismaEmployeeProfileRepository,
            },
            {
                provide: hash_service_interface_1.IHashService,
                useClass: bcrypt_hash_service_1.BcryptHashService,
            },
        ],
        controllers: [users_controller_1.UsersController]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map