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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminFeaturesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
let SuperAdminFeaturesService = class SuperAdminFeaturesService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async createPlan(data) {
        return this.prisma.plan.create({ data });
    }
    async getPlans() {
        return this.prisma.plan.findMany({ orderBy: { price: 'asc' } });
    }
    async updatePlan(id, data) {
        return this.prisma.plan.update({ where: { id }, data });
    }
    async deletePlan(id) {
        return this.prisma.plan.delete({ where: { id } });
    }
    async impersonate(institutionId) {
        const adminUser = await this.prisma.user.findFirst({
            where: { institutionId, role: 'ADMIN' },
        });
        if (!adminUser) {
            throw new common_1.NotFoundException('No admin found for this institution');
        }
        const payload = {
            sub: adminUser.id,
            email: adminUser.email,
            role: adminUser.role,
            institutionId: adminUser.institutionId
        };
        return {
            access_token: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET || 'fallback_secret' }),
        };
    }
    async getAnalytics() {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
        const data = months.map((month, index) => ({
            name: month,
            mrr: 5000 + (index * 1500) + Math.floor(Math.random() * 1000),
            signups: 2 + Math.floor(Math.random() * 5)
        }));
        return data;
    }
};
exports.SuperAdminFeaturesService = SuperAdminFeaturesService;
exports.SuperAdminFeaturesService = SuperAdminFeaturesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], SuperAdminFeaturesService);
//# sourceMappingURL=super-admin-features.service.js.map