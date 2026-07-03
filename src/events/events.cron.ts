import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../domain/entities/user.entity';

@Injectable()
export class EventsCronService {
  private readonly logger = new Logger(EventsCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    this.logger.debug('A verificar eventos nas próximas 24h...');
    
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingEvents = await this.prisma.event.findMany({
      where: {
        date: {
          gte: now,
          lte: tomorrow,
        }
      }
    });

    if (upcomingEvents.length === 0) return;

    for (const event of upcomingEvents) {
      // Find teachers and admins in the same institution to notify
      const usersToNotify = await this.prisma.user.findMany({
        where: {
          institutionId: event.institutionId,
          role: { in: [Role.TEACHER, Role.ADMIN, Role.STUDENT] }
        }
      });

      const notifications = usersToNotify.map(user => ({
        userId: user.id,
        title: 'Lembrete de Evento',
        description: `O evento "${event.title}" começa amanhã. Não se esqueça!`,
        institutionId: event.institutionId
      }));

      if (notifications.length > 0) {
        await this.prisma.notification.createMany({
          data: notifications
        });
      }
    }
    
    this.logger.debug(`Enviados lembretes para ${upcomingEvents.length} evento(s).`);
  }
}
