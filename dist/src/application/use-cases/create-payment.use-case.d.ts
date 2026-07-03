import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreatePaymentDto } from '../../presentation/dtos/create-payment.dto';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { NotificationService } from '../services/notification.service';
export declare class CreatePaymentUseCase {
    private readonly paymentRepository;
    private readonly userRepository;
    private readonly notificationService;
    constructor(paymentRepository: IPaymentRepository, userRepository: IUserRepository, notificationService: NotificationService);
    execute(dto: CreatePaymentDto, institutionId: string): Promise<PaymentEntity>;
}
