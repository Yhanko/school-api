import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface StudentPaymentSummary {
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCode: string | null;
  className: string | null;
  payments: {
    id: string;
    type: string;
    amount: number;
    status: string;
    paymentMethod: string | null;
    paymentDate: Date | null;
    proofUrl: string | null;
    createdAt: Date;
  }[];
  totalPaid: number;
  totalPending: number;
  hasOverdue: boolean;
  lastPaymentDate: Date | null;
  overallStatus: 'pago' | 'pendente' | 'atrasado' | 'sem_pagamento';
}

@Injectable()
export class GetStudentsPaymentOverviewUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(institutionId: string): Promise<StudentPaymentSummary[]> {
    // Fetch all students of this institution
    const students = await this.prisma.user.findMany({
      where: { institutionId, role: 'STUDENT' },
      include: {
        enrollments: {
          include: { class: { select: { name: true, grade: true } } },
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });

    if (students.length === 0) return [];

    const studentIds = students.map((s) => s.id);

    // Fetch ALL payments for these students
    const payments = await this.prisma.payment.findMany({
      where: { institutionId, studentId: { in: studentIds } },
      orderBy: { createdAt: 'desc' },
    });

    // Group payments by studentId
    const paymentsByStudent = new Map<string, typeof payments>();
    for (const p of payments) {
      if (!paymentsByStudent.has(p.studentId)) {
        paymentsByStudent.set(p.studentId, []);
      }
      paymentsByStudent.get(p.studentId)!.push(p);
    }

    return students.map((student) => {
      const studentPayments = paymentsByStudent.get(student.id) || [];

      const confirmedStatuses = ['confirmed', 'pago'];
      const pendingStatuses   = ['pending', 'pendente'];
      const overdueStatuses   = ['atrasado', 'overdue', 'cancelled'];

      const totalPaid = studentPayments
        .filter((p) => confirmedStatuses.includes(p.status))
        .reduce((acc, p) => acc + (p.amount || 0), 0);

      const totalPending = studentPayments
        .filter((p) => pendingStatuses.includes(p.status))
        .reduce((acc, p) => acc + (p.amount || 0), 0);

      const hasOverdue = studentPayments.some((p) => overdueStatuses.includes(p.status));

      const hasPending  = studentPayments.some((p) => pendingStatuses.includes(p.status));
      const hasPaid     = studentPayments.some((p) => confirmedStatuses.includes(p.status));

      let overallStatus: StudentPaymentSummary['overallStatus'];
      if (studentPayments.length === 0)  overallStatus = 'sem_pagamento';
      else if (hasOverdue)               overallStatus = 'atrasado';
      else if (hasPending)               overallStatus = 'pendente';
      else if (hasPaid)                  overallStatus = 'pago';
      else                               overallStatus = 'sem_pagamento';

      const lastPayment = studentPayments[0] ?? null;

      return {
        studentId:       student.id,
        studentName:     student.name,
        studentEmail:    student.email,
        studentCode:     (student as any).studentNumber ?? student.code ?? null,
        className:       (student as any).enrollments?.[0]?.class
                           ? `${(student as any).enrollments[0].class.grade ?? ''} ${(student as any).enrollments[0].class.name}`.trim()
                           : null,
        payments:        studentPayments.map((p) => ({
          id:            p.id,
          type:          p.type,
          amount:        p.amount,
          status:        p.status,
          paymentMethod: p.paymentMethod ?? null,
          paymentDate:   p.paymentDate ?? null,
          proofUrl:      (p as any).proofUrl ?? null,
          createdAt:     p.createdAt,
        })),
        totalPaid,
        totalPending,
        hasOverdue,
        lastPaymentDate: lastPayment?.paymentDate ?? lastPayment?.createdAt ?? null,
        overallStatus,
      };
    });
  }
}
