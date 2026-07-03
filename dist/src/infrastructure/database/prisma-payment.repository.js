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
exports.PrismaPaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const payment_entity_1 = require("../../domain/entities/payment.entity");
let PrismaPaymentRepository = class PrismaPaymentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    mapToEntity(model) {
        return new payment_entity_1.PaymentEntity(model.id, model.studentId, model.type, model.amount, model.institutionId, model.status, model.paymentDate, model.createdAt, model.updatedAt, model.student);
    }
    async create(payment) {
        const created = await this.prisma.payment.create({
            data: {
                studentId: payment.studentId,
                type: payment.type,
                amount: payment.amount,
                status: payment.status,
                institutionId: payment.institutionId,
            },
        });
        return this.mapToEntity(created);
    }
    async findAllByInstitution(institutionId) {
        const payments = await this.prisma.payment.findMany({
            where: { institutionId },
            orderBy: { createdAt: 'desc' },
            include: {
                student: {
                    select: { name: true, email: true }
                }
            }
        });
        return payments.map((p) => this.mapToEntity(p));
    }
    async findById(id) {
        const payment = await this.prisma.payment.findUnique({
            where: { id },
        });
        return payment ? this.mapToEntity(payment) : null;
    }
    async update(id, data) {
        const updated = await this.prisma.payment.update({
            where: { id },
            data: {
                status: data.status,
                paymentDate: data.paymentDate,
            },
        });
        return this.mapToEntity(updated);
    }
    async findByStudent(studentId) {
        const payments = await this.prisma.payment.findMany({
            where: { studentId },
            orderBy: { createdAt: 'desc' },
        });
        return payments.map(p => this.mapToEntity(p));
    }
};
exports.PrismaPaymentRepository = PrismaPaymentRepository;
exports.PrismaPaymentRepository = PrismaPaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaPaymentRepository);
//# sourceMappingURL=prisma-payment.repository.js.map