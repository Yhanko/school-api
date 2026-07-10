import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { PaymentEntity } from '../../domain/entities/payment.entity';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): PaymentEntity {
    return new PaymentEntity(
      model.id,
      model.studentId,
      model.type,
      model.amount,
      model.institutionId,
      model.status,
      model.description,
      model.dueDate,
      model.paymentDate,
      model.proofUrl,
      model.paymentMethod,
      model.createdAt,
      model.updatedAt,
      model.student,
    );
  }

  async create(payment: PaymentEntity): Promise<PaymentEntity> {
    const created = await this.prisma.payment.create({
      data: {
        studentId: payment.studentId,
        type: payment.type,
        amount: payment.amount,
        status: payment.status,
        institutionId: payment.institutionId,
        description: payment.description,
        dueDate: payment.dueDate,
        proofUrl: payment.proofUrl,
        paymentMethod: payment.paymentMethod,
      },
    });
    return this.mapToEntity(created);
  }

  async findAllByInstitution(institutionId: string): Promise<PaymentEntity[]> {
    const payments = await this.prisma.payment.findMany({
      where: { institutionId },
      orderBy: { createdAt: 'desc' },
      include: {
        student: {
          select: { name: true, email: true }
        }
      }
    });
    return payments.map((p) => this.mapToEntity(p));
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });
    return payment ? this.mapToEntity(payment) : null;
  }

  async update(id: string, data: Partial<PaymentEntity>): Promise<PaymentEntity> {
    const updated = await this.prisma.payment.update({
      where: { id },
      data: {
        status: data.status,
        paymentDate: data.paymentDate,
        proofUrl: data.proofUrl,
        paymentMethod: data.paymentMethod,
      },
    });
    return this.mapToEntity(updated);
  }

  async findByStudent(studentId: string): Promise<PaymentEntity[]> {
    const payments = await this.prisma.payment.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });
    return payments.map(p => this.mapToEntity(p));
  }
}
