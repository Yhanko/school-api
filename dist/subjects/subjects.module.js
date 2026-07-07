"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectsModule = void 0;
const common_1 = require("@nestjs/common");
const subjects_controller_1 = require("./subjects.controller");
const create_subject_use_case_1 = require("../application/use-cases/create-subject.use-case");
const get_subjects_use_case_1 = require("../application/use-cases/get-subjects.use-case");
const subject_repository_interface_1 = require("../domain/repositories/subject.repository.interface");
const prisma_subject_repository_1 = require("../infrastructure/database/prisma-subject.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let SubjectsModule = class SubjectsModule {
};
exports.SubjectsModule = SubjectsModule;
exports.SubjectsModule = SubjectsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [subjects_controller_1.SubjectsController],
        providers: [
            create_subject_use_case_1.CreateSubjectUseCase,
            get_subjects_use_case_1.GetSubjectsUseCase,
            {
                provide: subject_repository_interface_1.ISubjectRepository,
                useClass: prisma_subject_repository_1.PrismaSubjectRepository,
            }
        ],
    })
], SubjectsModule);
//# sourceMappingURL=subjects.module.js.map