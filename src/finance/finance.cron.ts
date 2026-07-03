import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../domain/entities/user.entity';

@Injectable()
export class FinanceCronService {
  private readonly logger = new Logger(FinanceCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Every day at 08:00 — Check for overdue payments (pending > 30 days).
   * Transitions them to 'overdue' and notifies the parent + secretary.
   */
  @Cron('0 8 * * *')
  async handleOverduePayments() {
    this.logger.log('🔍 Verificando pagamentos em atraso...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const overduePayments = await this.prisma.payment.findMany({
        where: {
          status: 'pending',
          createdAt: { lt: thirtyDaysAgo },
        },
        include: {
          student: { select: { name: true, parentId: true, institutionId: true } },
        },
      });

      if (overduePayments.length === 0) {
        this.logger.log('✅ Nenhum pagamento em atraso encontrado.');
        return;
      }

      this.logger.log(`⚠️ ${overduePayments.length} pagamentos em atraso encontrados.`);

      for (const payment of overduePayments) {
        // Update status to overdue
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'overdue' } as any,
        });

        const institutionId = payment.institutionId;
        const studentName = payment.student?.name || 'um aluno';
        const typeLabel = payment.type === 'tuition' ? 'Propina'
          : payment.type === 'enrollment' ? 'Matrícula' : 'Pagamento';

        const notificationsToCreate: any[] = [];

        // Notify parent
        if (payment.student?.parentId) {
          notificationsToCreate.push({
            userId: payment.student.parentId,
            title: `🔴 ${typeLabel} em Atraso`,
            description: `O pagamento de ${typeLabel} (${payment.amount} Kz) do educando ${studentName} está em atraso há mais de 30 dias. Por favor, regularize a situação.`,
            institutionId,
          });
        }

        // Notify secretaries
        const secretaries = await this.prisma.user.findMany({
          where: { institutionId, role: Role.SECRETARY },
          select: { id: true },
        });
        for (const sec of secretaries) {
          notificationsToCreate.push({
            userId: sec.id,
            title: `🔴 ${typeLabel} em Atraso — Ação Necessária`,
            description: `O pagamento de ${typeLabel} (${payment.amount} Kz) do aluno ${studentName} está em atraso. Verifique e contacte o encarregado.`,
            institutionId,
          });
        }

        if (notificationsToCreate.length > 0) {
          await this.prisma.notification.createMany({ data: notificationsToCreate });
        }
      }

      this.logger.log(`✅ ${overduePayments.length} pagamentos marcados como atrasados e notificações enviadas.`);
    } catch (error) {
      this.logger.error('❌ Erro ao verificar pagamentos em atraso', error);
    }
  }

  /**
   * Every Monday at 07:00 — Generate weekly attendance report for admins.
   * Alerts about classes where attendance is below 75%.
   */
  @Cron('0 7 * * 1')
  async handleWeeklyAttendanceReport() {
    this.logger.log('📊 Gerando relatório semanal de frequência...');
    try {
      // Get all institutions
      const institutions = await this.prisma.institution.findMany({
        where: { status: 'active' },
        select: { id: true, name: true },
      });

      for (const institution of institutions) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Get all attendance records for last week
        const attendanceRecords = await this.prisma.attendance.findMany({
          where: {
            institutionId: institution.id,
            date: { gte: oneWeekAgo },
          },
          include: {
            student: { select: { name: true, id: true } },
          },
        });

        if (attendanceRecords.length === 0) continue;

        // Group by student
        const byStudent: Record<string, { name: string; present: number; total: number }> = {};
        for (const rec of attendanceRecords) {
          const sid = rec.studentId;
          if (!byStudent[sid]) {
            byStudent[sid] = { name: rec.student.name, present: 0, total: 0 };
          }
          byStudent[sid].total++;
          if (rec.status === 'present' || rec.status === 'late') {
            byStudent[sid].present++;
          }
        }

        // Find students below 75% this week
        const criticalStudents = Object.entries(byStudent)
          .filter(([, data]) => data.total >= 3 && (data.present / data.total) < 0.75)
          .map(([id, data]) => ({ id, ...data, rate: Math.round((data.present / data.total) * 100) }));

        if (criticalStudents.length === 0) continue;

        // Notify admin
        const admin = await this.prisma.user.findFirst({
          where: { institutionId: institution.id, role: Role.ADMIN },
          select: { id: true },
        });

        if (admin) {
          const studentList = criticalStudents.map(s => `${s.name} (${s.rate}%)`).join(', ');
          await this.prisma.notification.create({
            data: {
              userId: admin.id,
              title: '📊 Relatório Semanal de Frequência',
              description: `${criticalStudents.length} aluno(s) com frequência abaixo de 75% esta semana: ${studentList}.`,
              institutionId: institution.id,
            },
          });
        }
      }

      this.logger.log('✅ Relatório semanal de frequência enviado.');
    } catch (error) {
      this.logger.error('❌ Erro ao gerar relatório de frequência', error);
    }
  }

  /**
   * Every 1st of the month at 06:00 — Academic risk analysis.
   * Notify parents of students with average below 10.
   */
  @Cron('0 6 1 * *')
  async handleMonthlyAcademicRiskReport() {
    this.logger.log('🎓 Gerando relatório mensal de risco académico...');
    try {
      const institutions = await this.prisma.institution.findMany({
        where: { status: 'active' },
        select: { id: true },
      });

      for (const institution of institutions) {
        // Find all students with at least one grade below 10 on average
        const allGrades = await this.prisma.grade.findMany({
          where: { institutionId: institution.id },
          include: {
            student: { select: { name: true, parentId: true } },
            subject: { select: { name: true } },
          },
        });

        // Group by student + subject
        const studentSubjectMap: Record<string, Record<string, number[]>> = {};
        for (const g of allGrades) {
          const sid = g.studentId;
          const subj = g.subject?.name || 'Geral';
          if (!studentSubjectMap[sid]) studentSubjectMap[sid] = {};
          if (!studentSubjectMap[sid][subj]) studentSubjectMap[sid][subj] = [];
          studentSubjectMap[sid][subj].push(g.value);
        }

        for (const [studentId, subjects] of Object.entries(studentSubjectMap)) {
          const weakSubjects = Object.entries(subjects)
            .map(([subj, vals]) => ({ subj, avg: vals.reduce((a, b) => a + b, 0) / vals.length }))
            .filter(x => x.avg < 10);

          if (weakSubjects.length === 0) continue;

          const student = allGrades.find(g => g.studentId === studentId)?.student;
          if (!student?.parentId) continue;

          const subjList = weakSubjects.map(x => `${x.subj} (${x.avg.toFixed(1)} val.)`).join(', ');
          await this.prisma.notification.create({
            data: {
              userId: student.parentId,
              title: '🎓 Relatório Mensal — Risco Académico',
              description: `O seu educando ${student.name} tem médias abaixo do mínimo nas seguintes disciplinas: ${subjList}. Recomendamos reforço escolar.`,
              institutionId: institution.id,
            },
          });
        }
      }

      this.logger.log('✅ Relatório mensal de risco académico enviado.');
    } catch (error) {
      this.logger.error('❌ Erro no relatório mensal académico', error);
    }
  }
}
