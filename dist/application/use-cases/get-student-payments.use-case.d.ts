import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';
export declare class GetStudentPaymentsUseCase {
    private readonly paymentRepository;
    constructor(paymentRepository: IPaymentRepository);
    execute(studentId: string, institutionId: string): Promise<PaymentEntity[]>;
}
