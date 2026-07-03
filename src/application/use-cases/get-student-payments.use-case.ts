import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';

@Injectable()
export class GetStudentPaymentsUseCase {
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(studentId: string, institutionId: string): Promise<PaymentEntity[]> {
    if (!studentId) {
      throw new BadRequestException('Student ID is required');
    }
    
    // Future validation: ensure the student belongs to institutionId
    // Actually, we could use Prisma directly or add a method in IPaymentRepository
    return this.paymentRepository.findByStudent(studentId);
  }
}
