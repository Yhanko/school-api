import { CreatePaymentDto } from '../presentation/dtos/create-payment.dto';
import { CreatePaymentUseCase } from '../application/use-cases/create-payment.use-case';
import { ConfirmPaymentUseCase } from '../application/use-cases/confirm-payment.use-case';
import { GetPaymentsUseCase } from '../application/use-cases/get-payments.use-case';
import { GetStudentPaymentsUseCase } from '../application/use-cases/get-student-payments.use-case';
import { SubmitPaymentProofUseCase } from '../application/use-cases/submit-payment-proof.use-case';
export declare class FinanceController {
    private readonly createPaymentUseCase;
    private readonly confirmPaymentUseCase;
    private readonly getPaymentsUseCase;
    private readonly getStudentPaymentsUseCase;
    private readonly submitPaymentProofUseCase;
    constructor(createPaymentUseCase: CreatePaymentUseCase, confirmPaymentUseCase: ConfirmPaymentUseCase, getPaymentsUseCase: GetPaymentsUseCase, getStudentPaymentsUseCase: GetStudentPaymentsUseCase, submitPaymentProofUseCase: SubmitPaymentProofUseCase);
    submitPaymentProof(id: string, body: {
        proofUrl: string;
        paymentMethod: string;
    }, user: any): Promise<{
        success: boolean;
        message: string;
        payment: {
            id: string;
            type: string;
            createdAt: Date;
            institutionId: string;
            updatedAt: Date;
            studentId: string;
            status: string;
            amount: number;
            paymentDate: Date | null;
            proofUrl: string | null;
            paymentMethod: string | null;
        };
    }>;
    createPayment(createPaymentDto: CreatePaymentDto, user: any): Promise<import("../domain/entities/payment.entity").PaymentEntity>;
    confirmPayment(id: string, user: any): Promise<import("../domain/entities/payment.entity").PaymentEntity>;
    getPayments(user: any, status?: string, studentId?: string, page?: string, limit?: string): Promise<{
        data: ({
            student: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            type: string;
            createdAt: Date;
            institutionId: string;
            updatedAt: Date;
            studentId: string;
            status: string;
            amount: number;
            paymentDate: Date | null;
            proofUrl: string | null;
            paymentMethod: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStudentPayments(studentId: string, user: any): Promise<import("../domain/entities/payment.entity").PaymentEntity[]>;
}
