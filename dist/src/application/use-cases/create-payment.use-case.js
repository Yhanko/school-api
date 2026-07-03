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
exports.CreatePaymentUseCase = void 0;
const common_1 = require("@nestjs/common");
const payment_repository_interface_1 = require("../../domain/repositories/payment.repository.interface");
const user_repository_interface_1 = require("../../domain/repositories/user.repository.interface");
const payment_entity_1 = require("../../domain/entities/payment.entity");
const user_entity_1 = require("../../domain/entities/user.entity");
const notification_service_1 = require("../services/notification.service");
let CreatePaymentUseCase = class CreatePaymentUseCase {
    paymentRepository;
    userRepository;
    notificationService;
    constructor(paymentRepository, userRepository, notificationService) {
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }
    async execute(dto, institutionId) {
        const student = await this.userRepository.findById(dto.studentId);
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        if (student.institutionId !== institutionId) {
            throw new common_1.BadRequestException('Student does not belong to your institution');
        }
        if (student.role !== user_entity_1.Role.STUDENT) {
            throw new common_1.BadRequestException('Payments can only be created for students');
        }
        const paymentEntity = new payment_entity_1.PaymentEntity('', dto.studentId, dto.type, dto.amount, institutionId, 'pending');
        const createdPayment = await this.paymentRepository.create(paymentEntity);
        await this.notificationService.notifyAdmins(institutionId, 'Novo Pagamento Registrado', `O aluno ${student.name} registrou um novo pagamento de R$ ${dto.amount}.`, 'info', 'medium');
        return createdPayment;
    }
};
exports.CreatePaymentUseCase = CreatePaymentUseCase;
exports.CreatePaymentUseCase = CreatePaymentUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(payment_repository_interface_1.IPaymentRepository)),
    __param(1, (0, common_1.Inject)(user_repository_interface_1.IUserRepository)),
    __metadata("design:paramtypes", [Object, Object, notification_service_1.NotificationService])
], CreatePaymentUseCase);
//# sourceMappingURL=create-payment.use-case.js.map