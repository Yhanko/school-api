import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(
    @Inject(IPaymentRepository)
    private readonly paymentRepository: IPaymentRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(id: string, status: string, institutionId: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findById(id);
    
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.institutionId !== institutionId) {
      throw new ForbiddenException('You do not have permission to modify this payment');
    }

    const updateData: any = { status };
    if (status === 'confirmed' || status === 'pago') {
      updateData.paymentDate = new Date();
    }

    const updatedPayment = await this.paymentRepository.update(id, updateData);

    // Notifications
    try {
      const student = await this.prisma.user.findUnique({
        where: { id: payment.studentId },
        select: { name: true, parentId: true },
      });

      const typeLabel = payment.type === 'tuition' ? 'Propina'
        : payment.type === 'enrollment' ? 'Matrícula'
        : 'Pagamento';

      let title = '';
      let description = '';

      if (status === 'confirmed' || status === 'pago') {
        title = `✅ ${typeLabel} Confirmada`;
        description = `O pagamento de ${payment.amount} Kz do educando ${student?.name} foi confirmado pela secretaria.`;
      } else if (status === 'cancelled' || status === 'atrasado') {
        title = `⚠️ ${typeLabel} em Atraso/Dívida`;
        description = `O pagamento de ${payment.amount} Kz do educando ${student?.name} encontra-se em atraso ou foi registado como dívida.`;
      } else if (status === 'pending' || status === 'pendente') {
        title = `⏳ ${typeLabel} Pendente`;
        description = `O pagamento de ${payment.amount} Kz do educando ${student?.name} foi marcado como pendente.`;
      }

      if (title && description && student) {
        // Notify Parent
        if (student.parentId) {
          await this.prisma.notification.create({
            data: {
              userId: student.parentId,
              title,
              description,
              type: 'pagamento',
              priority: (status === 'cancelled' || status === 'atrasado') ? 'high' : 'low',
              relatedStudentId: payment.studentId,
              institutionId,
            },
          });
        }
        
        // Notify Student
        await this.prisma.notification.create({
          data: {
            userId: payment.studentId,
            title,
            description: title.includes('Confirmada') 
              ? `O teu pagamento de ${payment.amount} Kz foi validado pela secretaria.`
              : description.replace(`do educando ${student.name}`, 'na tua conta'),
            type: 'pagamento',
            priority: (status === 'cancelled' || status === 'atrasado') ? 'high' : 'low',
            relatedStudentId: payment.studentId,
            institutionId,
          },
        });
      }
    } catch (e) {
      console.warn('Failed to send payment status notification:', e);
    }

    return updatedPayment;
  }
}
