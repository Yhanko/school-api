import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
export declare class MarkNotificationReadUseCase {
    private readonly notificationRepository;
    constructor(notificationRepository: INotificationRepository);
    execute(notificationId: string): Promise<void>;
}
