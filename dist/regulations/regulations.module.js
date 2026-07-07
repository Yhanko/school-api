"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegulationsModule = void 0;
const common_1 = require("@nestjs/common");
const regulations_controller_1 = require("./regulations.controller");
const create_regulation_use_case_1 = require("../application/use-cases/create-regulation.use-case");
const get_regulations_use_case_1 = require("../application/use-cases/get-regulations.use-case");
const publish_regulation_use_case_1 = require("../application/use-cases/publish-regulation.use-case");
const regulation_repository_interface_1 = require("../domain/repositories/regulation.repository.interface");
const prisma_regulation_repository_1 = require("../infrastructure/database/prisma-regulation.repository");
const prisma_module_1 = require("../prisma/prisma.module");
let RegulationsModule = class RegulationsModule {
};
exports.RegulationsModule = RegulationsModule;
exports.RegulationsModule = RegulationsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [regulations_controller_1.RegulationsController],
        providers: [
            create_regulation_use_case_1.CreateRegulationUseCase,
            get_regulations_use_case_1.GetRegulationsUseCase,
            publish_regulation_use_case_1.PublishRegulationUseCase,
            {
                provide: regulation_repository_interface_1.IRegulationRepository,
                useClass: prisma_regulation_repository_1.PrismaRegulationRepository,
            },
        ],
    })
], RegulationsModule);
//# sourceMappingURL=regulations.module.js.map