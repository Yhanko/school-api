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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const create_payment_dto_1 = require("../presentation/dtos/create-payment.dto");
const create_payment_use_case_1 = require("../application/use-cases/create-payment.use-case");
const confirm_payment_use_case_1 = require("../application/use-cases/confirm-payment.use-case");
const get_payments_use_case_1 = require("../application/use-cases/get-payments.use-case");
const get_student_payments_use_case_1 = require("../application/use-cases/get-student-payments.use-case");
const jwt_auth_guard_1 = require("../infrastructure/security/jwt-auth.guard");
const roles_guard_1 = require("../infrastructure/security/roles.guard");
const roles_decorator_1 = require("../infrastructure/security/roles.decorator");
const user_entity_1 = require("../domain/entities/user.entity");
const current_user_decorator_1 = require("../infrastructure/security/current-user.decorator");
const submit_payment_proof_use_case_1 = require("../application/use-cases/submit-payment-proof.use-case");
let FinanceController = class FinanceController {
    createPaymentUseCase;
    confirmPaymentUseCase;
    getPaymentsUseCase;
    getStudentPaymentsUseCase;
    submitPaymentProofUseCase;
    constructor(createPaymentUseCase, confirmPaymentUseCase, getPaymentsUseCase, getStudentPaymentsUseCase, submitPaymentProofUseCase) {
        this.createPaymentUseCase = createPaymentUseCase;
        this.confirmPaymentUseCase = confirmPaymentUseCase;
        this.getPaymentsUseCase = getPaymentsUseCase;
        this.getStudentPaymentsUseCase = getStudentPaymentsUseCase;
        this.submitPaymentProofUseCase = submitPaymentProofUseCase;
    }
    submitPaymentProof(id, body, user) {
        return this.submitPaymentProofUseCase.execute(id, body.proofUrl, body.paymentMethod, user.institutionId);
    }
    createPayment(createPaymentDto, user) {
        return this.createPaymentUseCase.execute(createPaymentDto, user.institutionId);
    }
    confirmPayment(id, user) {
        return this.confirmPaymentUseCase.execute(id, user.institutionId);
    }
    getPayments(user, status, studentId, page, limit) {
        return this.getPaymentsUseCase.execute(user.institutionId, { status, studentId, page: page ? parseInt(page) : 1, limit: limit ? parseInt(limit) : 50 });
    }
    getStudentPayments(studentId, user) {
        return this.getStudentPaymentsUseCase.execute(studentId, user.institutionId);
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Patch)('payments/:id/submit-proof'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.PARENT, user_entity_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "submitPaymentProof", null);
__decorate([
    (0, common_1.Post)('payments'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.PARENT, user_entity_1.Role.STUDENT),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Patch)('payments/:id/confirm'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "confirmPayment", null);
__decorate([
    (0, common_1.Get)('payments'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('studentId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('payments/student/:studentId'),
    (0, roles_decorator_1.Roles)(user_entity_1.Role.ADMIN, user_entity_1.Role.SECRETARY, user_entity_1.Role.PARENT, user_entity_1.Role.STUDENT),
    __param(0, (0, common_1.Param)('studentId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getStudentPayments", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [create_payment_use_case_1.CreatePaymentUseCase,
        confirm_payment_use_case_1.ConfirmPaymentUseCase,
        get_payments_use_case_1.GetPaymentsUseCase,
        get_student_payments_use_case_1.GetStudentPaymentsUseCase,
        submit_payment_proof_use_case_1.SubmitPaymentProofUseCase])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map