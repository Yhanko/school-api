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
exports.GenerateFinancialReportUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GenerateFinancialReportUseCase = class GenerateFinancialReportUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(institutionId) {
        const payments = await this.prisma.payment.findMany({
            where: { institutionId },
            include: {
                student: { select: { id: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        let totalExpected = 0;
        let totalCollected = 0;
        let totalPending = 0;
        let totalOverdue = 0;
        for (const p of payments) {
            totalExpected += p.amount;
            if (p.status === 'pago') {
                totalCollected += p.amount;
            }
            else if (p.status === 'pendente') {
                totalPending += p.amount;
            }
            else if (p.status === 'atrasado') {
                totalOverdue += p.amount;
            }
        }
        const defaultRate = totalExpected > 0 ? (totalOverdue / totalExpected) * 100 : 0;
        const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
        return {
            overview: {
                totalExpected: Number(totalExpected.toFixed(2)),
                totalCollected: Number(totalCollected.toFixed(2)),
                totalPending: Number(totalPending.toFixed(2)),
                totalOverdue: Number(totalOverdue.toFixed(2)),
                defaultRate: Number(defaultRate.toFixed(2)),
                collectionRate: Number(collectionRate.toFixed(2)),
            },
            recentTransactions: payments.slice(0, 15).map(p => ({
                id: p.id,
                studentName: p.student.name,
                type: p.type,
                amount: p.amount,
                status: p.status,
                date: p.paymentDate || p.createdAt,
            })),
        };
    }
};
exports.GenerateFinancialReportUseCase = GenerateFinancialReportUseCase;
exports.GenerateFinancialReportUseCase = GenerateFinancialReportUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GenerateFinancialReportUseCase);
//# sourceMappingURL=generate-financial-report.use-case.js.map