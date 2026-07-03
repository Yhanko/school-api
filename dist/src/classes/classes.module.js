"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassesModule = void 0;
const common_1 = require("@nestjs/common");
const classes_controller_1 = require("./classes.controller");
const create_class_use_case_1 = require("../application/use-cases/create-class.use-case");
const enroll_student_use_case_1 = require("../application/use-cases/enroll-student.use-case");
const class_repository_interface_1 = require("../domain/repositories/class.repository.interface");
const prisma_class_repository_1 = require("../infrastructure/database/prisma-class.repository");
const institution_repository_interface_1 = require("../domain/repositories/institution.repository.interface");
const prisma_institution_repository_1 = require("../infrastructure/database/prisma-institution.repository");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const prisma_user_repository_1 = require("../infrastructure/database/prisma-user.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let ClassesModule = class ClassesModule {
};
exports.ClassesModule = ClassesModule;
exports.ClassesModule = ClassesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [classes_controller_1.ClassesController],
        providers: [
            create_class_use_case_1.CreateClassUseCase,
            enroll_student_use_case_1.EnrollStudentUseCase,
            {
                provide: class_repository_interface_1.IClassRepository,
                useClass: prisma_class_repository_1.PrismaClassRepository,
            },
            {
                provide: institution_repository_interface_1.IInstitutionRepository,
                useClass: prisma_institution_repository_1.PrismaInstitutionRepository,
            },
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            }
        ],
    })
], ClassesModule);
//# sourceMappingURL=classes.module.js.map