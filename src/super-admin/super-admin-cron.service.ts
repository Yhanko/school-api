import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperAdminCronService {
  private readonly logger = new Logger(SuperAdminCronService.name);

  constructor(private readonly prisma: PrismaService) {}

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
            data: { status: 'blocked' },
          });
        });

        this.logger.log(`Suspended institution: ${sub.institution.name} (${sub.institutionId})`);
      }
    } catch (error) {
      this.logger.error('Failed to run subscription suspension cron job', error);
    }
  }
}
