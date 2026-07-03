import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@Injectable()
export class GetNotificationsUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<NotificationEntity[]> {
    return this.notificationRepository.findByUserId(userId);
  }
}
