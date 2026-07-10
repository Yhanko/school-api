import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreatePaymentDto } from '../../presentation/dtos/create-payment.dto';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { Role } from '../../domain/entities/user.entity';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly notificationService: NotificationService,
  ) {}

  async execute(dto: CreatePaymentDto, institutionId: string): Promise<PaymentEntity> {
    const student = await this.userRepository.findById(dto.studentId);
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.institutionId !== institutionId) {
      throw new BadRequestException('Student does not belong to your institution');
    }

    if (student.role !== Role.STUDENT) {
      throw new BadRequestException('Payments can only be created for students');
    }

    const paymentEntity = new PaymentEntity(
      '',
      dto.studentId,
      dto.type,
      dto.amount,
      institutionId,
      'pending',
      dto.description,
      dto.dueDate ? new Date(dto.dueDate) : undefined,
    );

    const createdPayment = await this.paymentRepository.create(paymentEntity);

    // Notify admins about the new payment
    await this.notificationService.notifyAdmins(
      institutionId,
      'Novo Pagamento Registrado',
      `O aluno ${student.name} registrou um novo pagamento de R$ ${dto.amount}.`,
      'info',
      'medium'
    );

    return createdPayment;
  }
}
