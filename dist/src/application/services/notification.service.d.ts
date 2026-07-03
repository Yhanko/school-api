import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly userRepository;
    constructor(notificationRepository: INotificationRepository, userRepository: IUserRepository);
    notifyUser(userId: string, institutionId: string, title: string, description: string, type?: string, priority?: string): Promise<void>;
    notifyAdmins(institutionId: string, title: string, description: string, type?: string, priority?: string): Promise<void>;
}
