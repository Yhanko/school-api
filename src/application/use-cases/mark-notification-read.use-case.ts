import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
  ) {}

  async execute(notificationId: string): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId);
  }
}
