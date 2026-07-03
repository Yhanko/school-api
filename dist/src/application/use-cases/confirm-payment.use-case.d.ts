import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PrismaService } from '../../prisma/prisma.service';
export declare class ConfirmPaymentUseCase {
    private readonly paymentRepository;
    private readonly prisma;
    constructor(paymentRepository: IPaymentRepository, prisma: PrismaService);
    execute(id: string, institutionId: string): Promise<PaymentEntity>;
}
