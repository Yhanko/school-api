import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface GetPaymentsFilters {
  status?: string;
  studentId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class GetPaymentsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(institutionId: string, filters: GetPaymentsFilters = {}) {
    const { status, studentId, page = 1, limit = 50 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { institutionId };
    if (status) where.status = status;
    if (studentId) where.studentId = studentId;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          student: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
