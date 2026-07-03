"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutionsModule = void 0;
const common_1 = require("@nestjs/common");
const institutions_controller_1 = require("../presentation/controllers/institutions.controller");
const create_institution_use_case_1 = require("../application/use-cases/create-institution.use-case");
const prisma_institution_repository_1 = require("../infrastructure/database/prisma-institution.repository");
const institution_repository_interface_1 = require("../domain/repositories/institution.repository.interface");
const prisma_module_1 = require("../prisma/prisma.module");
let InstitutionsModule = class InstitutionsModule {
};
exports.InstitutionsModule = InstitutionsModule;
exports.InstitutionsModule = InstitutionsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [institutions_controller_1.InstitutionsController],
        providers: [
            create_institution_use_case_1.CreateInstitutionUseCase,
            {
                provide: institution_repository_interface_1.IInstitutionRepository,
                useClass: prisma_institution_repository_1.PrismaInstitutionRepository,
            },
        ],
        exports: [institution_repository_interface_1.IInstitutionRepository],
    })
], InstitutionsModule);
//# sourceMappingURL=institutions.module.js.map