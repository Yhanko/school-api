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
exports.GetPaymentsUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GetPaymentsUseCase = class GetPaymentsUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(institutionId, filters = {}) {
        const { status, studentId, page = 1, limit = 50 } = filters;
        const skip = (page - 1) * limit;
        const where = { institutionId };
        if (status)
            where.status = status;
        if (studentId)
            where.studentId = studentId;
        const [payments, total] = await Promise.all([
            this.prisma.payment.findMany({
                where,
                include: {
                    student: { select: { id: true, name: true, email: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.payment.count({ where }),
        ]);
        return {
            data: payments,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
};
exports.GetPaymentsUseCase = GetPaymentsUseCase;
exports.GetPaymentsUseCase = GetPaymentsUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GetPaymentsUseCase);
//# sourceMappingURL=get-payments.use-case.js.map