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
exports.SubmitPaymentProofUseCase = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const user_entity_1 = require("../../domain/entities/user.entity");
let SubmitPaymentProofUseCase = class SubmitPaymentProofUseCase {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async execute(paymentId, proofUrl, paymentMethod, institutionId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                student: { select: { name: true, parentId: true } },
            },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.institutionId !== institutionId) {
            throw new common_1.ForbiddenException('You do not have permission to access this payment');
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                proofUrl,
                paymentMethod,
                status: 'processing',
            },
        });
        try {
            const secretaries = await this.prisma.user.findMany({
                where: { institutionId, role: user_entity_1.Role.SECRETARY },
                select: { id: true },
            });
            const studentName = payment.student?.name || 'um aluno';
            const methodLabel = paymentMethod === 'multicaixa' ? 'Multicaixa Express'
                : paymentMethod === 'transferencia' ? 'Transferência Bancária'
                    : 'Dinheiro';
            const typeLabel = payment.type === 'tuition' ? 'Propina'
                : payment.type === 'enrollment' ? 'Matrícula'
                    : 'Pagamento';
            const secretaryNotifs = secretaries.map(s => ({
                userId: s.id,
                title: `💳 Comprovativo de Pagamento — ${typeLabel}`,
                description: `${studentName} submeteu um comprovativo de ${typeLabel} (${payment.amount} Kz) via ${methodLabel}. Por favor valide o pagamento.`,
                institutionId,
            }));
            const admin = await this.prisma.user.findFirst({
                where: { institutionId, role: user_entity_1.Role.ADMIN },
                select: { id: true },
            });
            if (admin) {
                secretaryNotifs.push({
                    userId: admin.id,
                    title: `💳 Comprovativo de Pagamento Pendente — ${typeLabel}`,
                    description: `${studentName} submeteu um comprovativo de ${typeLabel} (${payment.amount} Kz) aguardando validação.`,
                    institutionId,
                });
            }
            if (secretaryNotifs.length > 0) {
                await this.prisma.notification.createMany({ data: secretaryNotifs });
            }
        }
        catch (e) {
            console.warn('Failed to notify secretaries about payment proof:', e);
        }
        return {
            success: true,
            message: 'Comprovativo submetido com sucesso. Aguarda validação.',
            payment: updatedPayment,
        };
    }
};
exports.SubmitPaymentProofUseCase = SubmitPaymentProofUseCase;
exports.SubmitPaymentProofUseCase = SubmitPaymentProofUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SubmitPaymentProofUseCase);
//# sourceMappingURL=submit-payment-proof.use-case.js.map