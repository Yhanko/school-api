import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';
export declare class GetNotificationsUseCase {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(userId: string): Promise<NotificationEntity[]>;
}
