import { PrismaService } from '../../prisma/prisma.service';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';
export declare class PrismaPaymentRepository implements IPaymentRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(payment: PaymentEntity): Promise<PaymentEntity>;
    findAllByInstitution(institutionId: string): Promise<PaymentEntity[]>;
    findById(id: string): Promise<PaymentEntity | null>;
    update(id: string, data: Partial<PaymentEntity>): Promise<PaymentEntity>;
    findByStudent(studentId: string): Promise<PaymentEntity[]>;
}
