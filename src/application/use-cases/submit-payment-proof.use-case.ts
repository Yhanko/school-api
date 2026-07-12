import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class SubmitPaymentProofUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(paymentId: string, proofUrl: string, paymentMethod: string, institutionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        student: { select: { name: true, parentId: true } },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.institutionId !== institutionId) {
      throw new ForbiddenException('You do not have permission to access this payment');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        proofUrl,
        paymentMethod,
        status: 'processing', // waiting for secretaria validation
      },
    });

    // 🔔 Notify all Secretaries that a payment proof needs validation
    try {
      const secretaries = await this.prisma.user.findMany({
        where: { institutionId, role: Role.SECRETARY },
        select: { id: true },
      });

      const studentName = payment.student?.name || 'um aluno';
      const methodLabel = paymentMethod === 'multicaixa' ? 'Multicaixa Express'
        : paymentMethod === 'transferencia' ? 'Transferência Bancária'
        : 'Dinheiro';
      const typeLabel = payment.type === 'tuition' ? 'Propina'
        : payment.type === 'enrollment' ? 'Matrícula'
        : 'Pagamento';

      const secretaryNotifs = secretaries.map(s => ({
        userId: s.id,
        title: `💳 Comprovativo de Pagamento — ${typeLabel}`,
        description: `${studentName} submeteu um comprovativo de ${typeLabel} (${payment.amount} Kz) via ${methodLabel}. Por favor valide o pagamento.`,
        type: 'pagamento',
        priority: 'high',
        relatedStudentId: payment.studentId,
        institutionId,
      }));

      // Also notify admin
      const admin = await this.prisma.user.findFirst({
        where: { institutionId, role: Role.ADMIN },
        select: { id: true },
      });
      if (admin) {
        secretaryNotifs.push({
          userId: admin.id,
          title: `💳 Comprovativo de Pagamento Pendente — ${typeLabel}`,
          description: `${studentName} submeteu um comprovativo de ${typeLabel} (${payment.amount} Kz) aguardando validação.`,
          type: 'pagamento',
          priority: 'high',
          relatedStudentId: payment.studentId,
          institutionId,
        });
      }

      if (secretaryNotifs.length > 0) {
        await this.prisma.notification.createMany({ data: secretaryNotifs });
      }
    } catch (e) {
      console.warn('Failed to notify secretaries about payment proof:', e);
    }

    return {
      success: true,
      message: 'Comprovativo submetido com sucesso. Aguarda validação.',
      payment: updatedPayment,
    };
  }
}
