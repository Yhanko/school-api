"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const common_1 = require("@nestjs/common");
const finance_controller_1 = require("./finance.controller");
const finance_cron_1 = require("./finance.cron");
const create_payment_use_case_1 = require("../application/use-cases/create-payment.use-case");
const confirm_payment_use_case_1 = require("../application/use-cases/confirm-payment.use-case");
const get_payments_use_case_1 = require("../application/use-cases/get-payments.use-case");
const get_student_payments_use_case_1 = require("../application/use-cases/get-student-payments.use-case");
const submit_payment_proof_use_case_1 = require("../application/use-cases/submit-payment-proof.use-case");
const payment_repository_interface_1 = require("../domain/repositories/payment.repository.interface");
const prisma_payment_repository_1 = require("../infrastructure/database/prisma-payment.repository");
const user_repository_interface_1 = require("../domain/repositories/user.repository.interface");
const prisma_user_repository_1 = require("../infrastructure/database/prisma-user.repository");
const prisma_module_1 = require("../prisma/prisma.module");
const notifications_module_1 = require("../notifications/notifications.module");
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, notifications_module_1.NotificationsModule],
        controllers: [finance_controller_1.FinanceController],
        providers: [
            finance_cron_1.FinanceCronService,
            create_payment_use_case_1.CreatePaymentUseCase,
            confirm_payment_use_case_1.ConfirmPaymentUseCase,
            get_payments_use_case_1.GetPaymentsUseCase,
            get_student_payments_use_case_1.GetStudentPaymentsUseCase,
            submit_payment_proof_use_case_1.SubmitPaymentProofUseCase,
            {
                provide: payment_repository_interface_1.IPaymentRepository,
                useClass: prisma_payment_repository_1.PrismaPaymentRepository,
            },
            {
                provide: user_repository_interface_1.IUserRepository,
                useClass: prisma_user_repository_1.PrismaUserRepository,
            }
        ],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map