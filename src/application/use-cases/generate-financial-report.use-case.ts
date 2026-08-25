import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class GenerateFinancialReportUseCase {
  constructor(private prisma: PrismaService) {}

  async execute(institutionId: string) {
    const payments = await this.prisma.payment.findMany({
      where: { institutionId },
      include: {
        student: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    let totalExpected = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let totalOverdue = 0;

    for (const p of payments) {
      totalExpected += p.amount;
      if (p.status === 'pago' || p.status === 'confirmed') {
        totalCollected += p.amount;
      } else if (p.status === 'pendente' || p.status === 'pending') {
        totalPending += p.amount;
      } else if (p.status === 'atrasado' || p.status === 'cancelled') {
        totalOverdue += p.amount;
      }
    }

    const defaultRate = totalExpected > 0 ? (totalOverdue / totalExpected) * 100 : 0;
    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

    return {
      overview: {
        totalExpected: Number(totalExpected.toFixed(2)),
        totalCollected: Number(totalCollected.toFixed(2)),
        totalPending: Number(totalPending.toFixed(2)),
        totalOverdue: Number(totalOverdue.toFixed(2)),
        defaultRate: Number(defaultRate.toFixed(2)),
        collectionRate: Number(collectionRate.toFixed(2)),
      },
      recentTransactions: payments.slice(0, 15).map(p => ({
        id: p.id,
        studentName: p.student.name,
        type: p.type,
        amount: p.amount,
        status: p.status,
        date: p.paymentDate || p.createdAt,
      })),
    };
  }
}
