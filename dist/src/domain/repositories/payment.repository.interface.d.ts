import { PaymentEntity } from '../entities/payment.entity';
export declare const IPaymentRepository: unique symbol;
export interface IPaymentRepository {
    create(payment: PaymentEntity): Promise<PaymentEntity>;
    findAllByInstitution(institutionId: string): Promise<PaymentEntity[]>;
    findById(id: string): Promise<PaymentEntity | null>;
    update(id: string, data: Partial<PaymentEntity>): Promise<PaymentEntity>;
    findByStudent(studentId: string): Promise<PaymentEntity[]>;
}
