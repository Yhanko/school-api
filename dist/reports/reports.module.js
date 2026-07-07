"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const reports_controller_1 = require("./reports.controller");
const generate_academic_report_use_case_1 = require("../application/use-cases/generate-academic-report.use-case");
const generate_financial_report_use_case_1 = require("../application/use-cases/generate-financial-report.use-case");
const generate_administrative_report_use_case_1 = require("../application/use-cases/generate-administrative-report.use-case");
const prisma_module_1 = require("../prisma/prisma.module");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [reports_controller_1.ReportsController],
        providers: [
            generate_academic_report_use_case_1.GenerateAcademicReportUseCase,
            generate_financial_report_use_case_1.GenerateFinancialReportUseCase,
            generate_administrative_report_use_case_1.GenerateAdministrativeReportUseCase,
        ],
    })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map