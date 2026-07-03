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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
const generate_academic_report_use_case_1 = require("../application/use-cases/generate-academic-report.use-case");
const generate_financial_report_use_case_1 = require("../application/use-cases/generate-financial-report.use-case");
const generate_administrative_report_use_case_1 = require("../application/use-cases/generate-administrative-report.use-case");
let ReportsController = class ReportsController {
    generateAcademicReportUseCase;
    generateFinancialReportUseCase;
    generateAdministrativeReportUseCase;
    constructor(generateAcademicReportUseCase, generateFinancialReportUseCase, generateAdministrativeReportUseCase) {
        this.generateAcademicReportUseCase = generateAcademicReportUseCase;
        this.generateFinancialReportUseCase = generateFinancialReportUseCase;
        this.generateAdministrativeReportUseCase = generateAdministrativeReportUseCase;
    }
    getAcademicReport(user) {
        return this.generateAcademicReportUseCase.execute(user.institutionId);
    }
    getFinancialReport(user) {
        return this.generateFinancialReportUseCase.execute(user.institutionId);
    }
    getAdministrativeReport(user) {
        return this.generateAdministrativeReportUseCase.execute(user.institutionId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('academic'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAcademicReport", null);
__decorate([
    (0, common_1.Get)('financial'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getFinancialReport", null);
__decorate([
    (0, common_1.Get)('administrative'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getAdministrativeReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN, user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __metadata("design:paramtypes", [generate_academic_report_use_case_1.GenerateAcademicReportUseCase,
        generate_financial_report_use_case_1.GenerateFinancialReportUseCase,
        generate_administrative_report_use_case_1.GenerateAdministrativeReportUseCase])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map