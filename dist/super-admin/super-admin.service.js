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
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const user_entity_1 = require("../domain/entities/user.entity");
const hash_service_interface_1 = require("../application/interfaces/hash.service.interface");
let SuperAdminService = class SuperAdminService {
    prisma;
    hashService;
    constructor(prisma, hashService) {
        this.prisma = prisma;
        this.hashService = hashService;
    }
    async createSchool(dto, adminId, ipAddress) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.adminEmail },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('Email already in use for admin');
        }
        const hashedPassword = await this.hashService.hash(dto.adminPassword);
        return this.prisma.$transaction(async (tx) => {
            const institution = await tx.institution.create({
                data: {
                    name: dto.schoolName,
                    email: dto.schoolEmail,
                    address: dto.schoolAddress,
                    phone: dto.schoolPhone,
                },
            });
            const admin = await tx.user.create({
                data: {
                    name: dto.adminName,
                    email: dto.adminEmail,
                    password: hashedPassword,
                    role: user_entity_1.Role.ADMIN,
                    institutionId: institution.id,
                },
            });
            const endDate = new Date();
            endDate.setFullYear(endDate.getFullYear() + 1);
            let plan = await tx.plan.findFirst({ where: { name: dto.planId } });
            if (!plan) {
                plan = await tx.plan.findUnique({ where: { id: dto.planId } }).catch(() => null);
            }
            if (!plan) {
                plan = await tx.plan.create({
                    data: { name: dto.planId || 'basic', price: 0, features: [] }
                });
            }
            const subscription = await tx.subscription.create({
                data: {
                    institutionId: institution.id,
                    planId: plan.id,
                    endDate,
                    status: 'active',
                },
            });
            const defaultSubjects = [
                'Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Educação Física'
            ];
            await tx.subject.createMany({
                data: defaultSubjects.map(name => ({
                    name,
                    code: name.substring(0, 3).toUpperCase(),
                    institutionId: institution.id
                }))
            });
            await tx.activityLog.create({
                data: {
                    action: 'CREATE_SCHOOL',
                    resource: 'Institution',
                    details: `School ${institution.name} and admin ${admin.email} created.`,
                    institutionId: institution.id,
                    userId: adminId,
                    ipAddress: ipAddress || '127.0.0.1',
                },
            });
            return { institution, admin, subscription };
        });
    }
    async getInstitutionsMetrics() {
        const institutions = await this.prisma.institution.findMany({
            include: {
                subscriptions: {
                    include: { plan: true },
                    where: { status: 'active' },
                    take: 1,
                },
                _count: {
                    select: {
                        users: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return Promise.all(institutions.map(async (inst) => {
            const studentsCount = await this.prisma.user.count({ where: { institutionId: inst.id, role: user_entity_1.Role.STUDENT } });
            const teachersCount = await this.prisma.user.count({ where: { institutionId: inst.id, role: user_entity_1.Role.TEACHER } });
            const staffCount = await this.prisma.user.count({
                where: {
                    institutionId: inst.id,
                    role: { in: [user_entity_1.Role.SECRETARY, user_entity_1.Role.ADMIN] }
                }
            });
            const admin = await this.prisma.user.findFirst({
                where: { institutionId: inst.id, role: user_entity_1.Role.ADMIN }
            });
            return {
                id: inst.id,
                name: inst.name,
                code: `ESC${inst.id.substring(0, 4).toUpperCase()}`,
                email: inst.email,
                phone: inst.phone || null,
                address: inst.address,
                createdAt: inst.createdAt,
                totalUsers: inst._count.users,
                studentsCount,
                teachersCount,
                staffCount,
                director: admin?.name || 'N/A',
                subscription_plan: inst.subscriptions[0]?.plan?.name || 'free',
                subscription_expires_at: inst.subscriptions[0]?.endDate,
                status: inst.subscriptions[0]?.status || 'inactive',
                monthlyRevenue: inst.subscriptions[0]?.plan?.price || 0,
            };
        }));
    }
    async getDashboardMetrics() {
        const totalSchools = await this.prisma.institution.count();
        const totalStudents = await this.prisma.user.count({ where: { role: user_entity_1.Role.STUDENT } });
        const totalTeachers = await this.prisma.user.count({ where: { role: user_entity_1.Role.TEACHER } });
        const activeSubscriptions = await this.prisma.subscription.count({ where: { status: 'active' } });
        const activePlans = await this.prisma.subscription.findMany({
            where: { status: 'active' },
            include: { plan: true },
        });
        const monthlyRevenue = activePlans.reduce((acc, sub) => acc + (sub.plan?.price || 0), 0);
        return {
            totalSchools,
            totalStudents,
            totalTeachers,
            activeSubscriptions,
            monthlyRevenue,
        };
    }
    async getLogs() {
        return this.prisma.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
            include: {
                user: { select: { name: true, email: true, role: true } },
                institution: { select: { name: true } },
            },
        });
    }
    async registerSuperAdmin(name, email, password) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.BadRequestException('Email já em uso');
        }
        const hashedPassword = await this.hashService.hash(password);
        return this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: user_entity_1.Role.SUPER_ADMIN,
            },
        });
    }
    async createPlan(name, price, features) {
        return this.prisma.plan.create({
            data: { name, price, features },
        });
    }
    async getPlans() {
        return this.prisma.plan.findMany();
    }
    async getUsers(roleFilter) {
        const whereClause = {};
        if (roleFilter) {
            whereClause.role = roleFilter;
        }
        return this.prisma.user.findMany({
            where: whereClause,
            include: {
                institution: { select: { name: true, id: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPayments() {
        return this.prisma.payment.findMany({
            include: {
                student: { select: { name: true, institution: { select: { name: true, id: true } } } },
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getPlatforms() {
        return this.prisma.platform.findMany({
            include: {
                institution: { select: { name: true, id: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async createBroadcast(message, type, expiresAt) {
        return this.prisma.globalBroadcast.create({
            data: { message, type, expiresAt }
        });
    }
    async getActiveBroadcasts() {
        return this.prisma.globalBroadcast.findMany({
            where: {
                active: true,
                OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getInstitutionsHealth() {
        const institutions = await this.prisma.institution.findMany({
            include: { users: { select: { id: true, role: true, lastLogin: true } } }
        });
        const now = new Date();
        const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
        return institutions.map(inst => {
            const students = inst.users.filter(u => u.role === user_entity_1.Role.STUDENT).length;
            const activeUsers = inst.users.filter(u => u.lastLogin && u.lastLogin >= fifteenDaysAgo).length;
            let healthStatus = 'GOOD';
            if (inst.status === 'blocked')
                healthStatus = 'BLOCKED';
            else if (students > 0 && activeUsers === 0)
                healthStatus = 'CRITICAL';
            else if (students > 0 && activeUsers / students < 0.2)
                healthStatus = 'AT_RISK';
            return {
                id: inst.id,
                name: inst.name,
                status: inst.status,
                totalStudents: students,
                activeUsersL15D: activeUsers,
                healthStatus
            };
        });
    }
    async getSystemHealth() {
        let dbStatus = 'healthy';
        let dbLatency = 0;
        try {
            const start = Date.now();
            await this.prisma.$queryRaw `SELECT 1`;
            dbLatency = Date.now() - start;
        }
        catch (e) {
            dbStatus = 'down';
        }
        return {
            database: {
                status: dbStatus,
                latency: dbLatency,
            },
            api: {
                status: 'healthy',
                uptime: process.uptime(),
            }
        };
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(hash_service_interface_1.IHashService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map