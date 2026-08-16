import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class SuperAdminCronService {
  private readonly logger = new Logger(SuperAdminCronService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly smsService: SmsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionSuspension() {
    this.logger.log('Running daily subscription suspension check...');
    try {
      const now = new Date();
      
      const expiredSubscriptions = await this.prisma.subscription.findMany({
        where: {
          endDate: {
            lt: now,
          },
          status: 'active',
        },
        include: {
          institution: true,
        },
      });

      if (expiredSubscriptions.length === 0) {
        this.logger.log('No expired subscriptions found.');
        return;
      }

      this.logger.log(`Found ${expiredSubscriptions.length} expired subscriptions to suspend.`);

      for (const sub of expiredSubscriptions) {
        await this.prisma.$transaction(async (tx) => {
          await tx.subscription.update({
            where: { id: sub.id },
            data: { status: 'expired' },
          });

          await tx.institution.update({
            where: { id: sub.institutionId },
            data: { status: 'payment_restricted' },
          });
        });

        this.logger.log(`Suspended institution: ${sub.institution.name} (${sub.institutionId})`);
      }
    } catch (error) {
      this.logger.error('Failed to run subscription suspension cron job', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleSubscriptionWarnings() {
    this.logger.log('Running daily subscription warnings check...');
    try {
      const now = new Date();
      const targetDays = [7, 3, 1];

      for (const days of targetDays) {
        const targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + days);
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

        const expiringSubscriptions = await this.prisma.subscription.findMany({
          where: {
            endDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
            status: 'active',
          },
          include: {
            institution: true,
          },
        });

        for (const sub of expiringSubscriptions) {
          if (sub.institution.phone) {
            const message = `Aviso: A subscrição da sua escola (${sub.institution.name}) termina em ${days} dia(s). Regularize o pagamento para evitar restrições de acesso.`;
            await this.smsService.sendBulkSms(
              'Yhanko',
              'Aviso de Subscrição',
              message,
              [sub.institution.phone]
            );
            this.logger.log(`Warning SMS sent to institution: ${sub.institution.name} for ${days} days left.`);
          }
        }
      }
    } catch (error) {
      this.logger.error('Failed to run subscription warnings cron job', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldActivityLogs() {
    this.logger.log('Running daily cleanup for old activity logs...');
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const deleted = await this.prisma.activityLog.deleteMany({
        where: {
          createdAt: {
            lt: sevenDaysAgo,
          },
        },
      });

      this.logger.log(`Cleaned up ${deleted.count} old activity logs.`);
    } catch (error) {
      this.logger.error('Failed to clean up old activity logs', error);
    }
  }
}
