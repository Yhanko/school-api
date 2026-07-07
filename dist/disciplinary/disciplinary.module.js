"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisciplinaryModule = void 0;
const common_1 = require("@nestjs/common");
const disciplinary_controller_1 = require("./disciplinary.controller");
const create_disciplinary_use_case_1 = require("../application/use-cases/create-disciplinary.use-case");
const get_disciplinary_records_use_case_1 = require("../application/use-cases/get-disciplinary-records.use-case");
const update_disciplinary_status_use_case_1 = require("../application/use-cases/update-disciplinary-status.use-case");
const disciplinary_repository_interface_1 = require("../domain/repositories/disciplinary.repository.interface");
const prisma_disciplinary_repository_1 = require("../infrastructure/database/prisma-disciplinary.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let DisciplinaryModule = class DisciplinaryModule {
};
exports.DisciplinaryModule = DisciplinaryModule;
exports.DisciplinaryModule = DisciplinaryModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [disciplinary_controller_1.DisciplinaryController],
        providers: [
            create_disciplinary_use_case_1.CreateDisciplinaryUseCase,
            get_disciplinary_records_use_case_1.GetDisciplinaryRecordsUseCase,
            update_disciplinary_status_use_case_1.UpdateDisciplinaryStatusUseCase,
            {
                provide: disciplinary_repository_interface_1.IDisciplinaryRepository,
                useClass: prisma_disciplinary_repository_1.PrismaDisciplinaryRepository,
            },
        ],
    })
], DisciplinaryModule);
//# sourceMappingURL=disciplinary.module.js.map