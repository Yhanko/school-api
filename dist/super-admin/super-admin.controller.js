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
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const super_admin_service_1 = require("./super-admin.service");
const super_admin_features_service_1 = require("./super-admin-features.service");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
let SuperAdminController = class SuperAdminController {
    superAdminService;
    featuresService;
    constructor(superAdminService, featuresService) {
        this.superAdminService = superAdminService;
        this.featuresService = featuresService;
    }
    async getDashboard() {
        return this.superAdminService.getDashboardMetrics();
    }
    async createSchool(dto, req) {
        const ipAddress = req.ip || req.connection?.remoteAddress;
        const userId = req.user?.id || req.user?.sub;
        return this.superAdminService.createSchool(dto, userId, ipAddress);
    }
    async getSchools(status) {
        return this.superAdminService.getInstitutionsMetrics();
    }
    async getStudents() {
        return this.superAdminService.getUsers(user_entity_1.Role.STUDENT);
    }
    async getTeachers() {
        return this.superAdminService.getUsers(user_entity_1.Role.TEACHER);
    }
    async getParents() {
        return this.superAdminService.getUsers(user_entity_1.Role.PARENT);
    }
    async getPayments() {
        return this.superAdminService.getPayments();
    }
    async getPlatforms() {
        return this.superAdminService.getPlatforms();
    }
    async getSystemHealth() {
        return this.superAdminService.getSystemHealth();
    }
    async createBroadcast(body) {
        return this.superAdminService.createBroadcast(body.message, body.type, body.expiresAt ? new Date(body.expiresAt) : undefined);
    }
    async getHealth() {
        return this.superAdminService.getInstitutionsHealth();
    }
    async getLogs() {
        return this.superAdminService.getLogs();
    }
    async getAnalytics() {
        return this.featuresService.getAnalytics();
    }
    async impersonate(institutionId) {
        return this.featuresService.impersonate(institutionId);
    }
    async getPlans() {
        return this.featuresService.getPlans();
    }
    async createPlan(body) {
        return this.featuresService.createPlan(body);
    }
    async updatePlan(id, body) {
        return this.featuresService.updatePlan(id, body);
    }
    async deletePlan(id) {
        return this.featuresService.deletePlan(id);
    }
};
exports.SuperAdminController = SuperAdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Post)('schools'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "createSchool", null);
__decorate([
    (0, common_1.Get)('schools'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getSchools", null);
__decorate([
    (0, common_1.Get)('students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getStudents", null);
__decorate([
    (0, common_1.Get)('teachers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getTeachers", null);
__decorate([
    (0, common_1.Get)('parents'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getParents", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('platforms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getPlatforms", null);
__decorate([
    (0, common_1.Get)('system-health'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Post)('broadcasts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "createBroadcast", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getAnalytics", null);
__decorate([
    (0, common_1.Post)('impersonate/:institutionId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('institutionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "impersonate", null);
__decorate([
    (0, common_1.Get)('plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Post)('plans'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "createPlan", null);
__decorate([
    (0, common_1.Put)('plans/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Delete)('plans/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.SUPER_ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "deletePlan", null);
exports.SuperAdminController = SuperAdminController = __decorate([
    (0, common_1.Controller)('super-admin'),
    __metadata("design:paramtypes", [super_admin_service_1.SuperAdminService,
        super_admin_features_service_1.SuperAdminFeaturesService])
], SuperAdminController);
//# sourceMappingURL=super-admin.controller.js.map