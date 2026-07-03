"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradesModule = void 0;
const common_1 = require("@nestjs/common");
const grades_controller_1 = require("./grades.controller");
const create_grade_use_case_1 = require("../application/use-cases/create-grade.use-case");
const get_student_grades_use_case_1 = require("../application/use-cases/get-student-grades.use-case");
const grade_repository_interface_1 = require("../domain/repositories/grade.repository.interface");
const prisma_grade_repository_1 = require("../infrastructure/database/prisma-grade.repository");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const prisma_user_repository_1 = require("../infrastructure/database/prisma-user.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let GradesModule = class GradesModule {
};
exports.GradesModule = GradesModule;
exports.GradesModule = GradesModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [grades_controller_1.GradesController],
        providers: [
            create_grade_use_case_1.CreateGradeUseCase,
            get_student_grades_use_case_1.GetStudentGradesUseCase,
            {
                provide: grade_repository_interface_1.IGradeRepository,
                useClass: prisma_grade_repository_1.PrismaGradeRepository,
            },
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            }
        ],
    })
], GradesModule);
//# sourceMappingURL=grades.module.js.map