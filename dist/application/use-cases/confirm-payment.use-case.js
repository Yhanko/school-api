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
exports.ConfirmPaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_interface_1 = require("../../domain/repositories/payment.repository.interface");
const prisma_service_1 = require("../../prisma/prisma.service");
let ConfirmPaymentUseCase = class ConfirmPaymentUseCase {
    paymentRepository;
    prisma;
    constructor(paymentRepository, prisma) {
        this.paymentRepository = paymentRepository;
        this.prisma = prisma;
    }
    async execute(id, institutionId) {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.institutionId !== institutionId) {
            throw new common_1.ForbiddenException('You do not have permission to confirm this payment');
        }
        const confirmed = await this.paymentRepository.update(id, {
            status: 'confirmed',
            paymentDate: new Date(),
        });
        try {
            const student = await this.prisma.user.findUnique({
                where: { id: payment.studentId },
                select: { name: true, parentId: true },
            });
            if (student?.parentId) {
                const typeLabel = payment.type === 'tuition' ? 'Propina'
                    : payment.type === 'enrollment' ? 'Matrícula'
                        : 'Pagamento';
                await this.prisma.notification.create({
                    data: {
                        userId: student.parentId,
                        title: `✅ ${typeLabel} Confirmada`,
                        description: `O pagamento de ${payment.amount} Kz do educando ${student.name} foi confirmado pela secretaria. O recibo já está disponível.`,
                        institutionId,
                    },
                });
            }
            if (student) {
                await this.prisma.notification.create({
                    data: {
                        userId: payment.studentId,
                        title: '✅ Pagamento Confirmado',
                        description: `O teu pagamento de ${payment.amount} Kz foi validado pela secretaria. Obrigado!`,
                        institutionId,
                    },
                });
            }
        }
        catch (e) {
            console.warn('Failed to send payment confirmation notification:', e);
        }
        return confirmed;
    }
};
exports.ConfirmPaymentUseCase = ConfirmPaymentUseCase;
exports.ConfirmPaymentUseCase = ConfirmPaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_repository_interface_1.IPaymentRepository)),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], ConfirmPaymentUseCase);
//# sourceMappingURL=confirm-payment.use-case.js.map