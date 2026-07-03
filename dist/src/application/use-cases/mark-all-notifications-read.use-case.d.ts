import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
export declare class MarkAllNotificationsReadUseCase {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(userId: string): Promise<void>;
}
