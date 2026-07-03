import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { GetNotificationsUseCase } from '../application/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from '../application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../application/use-cases/mark-all-notifications-read.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly getNotificationsUseCase: GetNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  getNotifications(@CurrentUser() user: any) {
    return this.getNotificationsUseCase.execute(user.sub);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentUser() user: any) {
    return this.markAllNotificationsReadUseCase.execute(user.sub);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.markNotificationReadUseCase.execute(id);
  }
}
