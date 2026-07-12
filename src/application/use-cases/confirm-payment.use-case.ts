import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class ConfirmPaymentUseCase {
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, institutionId: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findById(id);
    
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.institutionId !== institutionId) {
      throw new ForbiddenException('You do not have permission to confirm this payment');
    }

    const confirmed = await this.paymentRepository.update(id, {
      status: 'confirmed',
      paymentDate: new Date(),
    });

    // 🔔 Notify the student's parent (encarregado) that payment was confirmed
    try {
      const student = await this.prisma.user.findUnique({
        where: { id: payment.studentId },
        select: { name: true, parentId: true },
      });

      if (student?.parentId) {
        const typeLabel = payment.type === 'tuition' ? 'Propina'
          : payment.type === 'enrollment' ? 'Matrícula'
          : 'Pagamento';

        await this.prisma.notification.create({
          data: {
            userId: student.parentId,
            title: `✅ ${typeLabel} Confirmada`,
            description: `O pagamento de ${payment.amount} Kz do educando ${student.name} foi confirmado pela secretaria. O recibo já está disponível.`,
            type: 'pagamento',
            priority: 'low',
            relatedStudentId: payment.studentId,
            institutionId,
          },
        });
      }

      // 🔔 Also notify the student directly
      if (student) {
        await this.prisma.notification.create({
          data: {
            userId: payment.studentId,
            title: '✅ Pagamento Confirmado',
            description: `O teu pagamento de ${payment.amount} Kz foi validado pela secretaria. Obrigado!`,
            type: 'pagamento',
            priority: 'low',
            relatedStudentId: payment.studentId,
            institutionId,
          },
        });
      }
    } catch (e) {
      // Non-blocking: don't fail the confirmation if notification fails
      console.warn('Failed to send payment confirmation notification:', e);
    }

    return confirmed;
  }
}
