import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from '../application/services/notification.service';
import { GetNotificationsUseCase } from '../application/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from '../application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../application/use-cases/mark-all-notifications-read.use-case';
import { INotificationRepository } from '../domain/repositories/notification.repository.interface';
import { PrismaNotificationRepository } from '../infrastructure/database/prisma-notification.repository';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/database/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [
    NotificationService,
    GetNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    {
      provide: INotificationRepository,
      useClass: PrismaNotificationRepository,
    },
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    }
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
