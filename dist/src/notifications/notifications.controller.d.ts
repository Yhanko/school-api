import { GetNotificationsUseCase } from '../application/use-cases/get-notifications.use-case';
import { MarkNotificationReadUseCase } from '../application/use-cases/mark-notification-read.use-case';
import { MarkAllNotificationsReadUseCase } from '../application/use-cases/mark-all-notifications-read.use-case';
export declare class NotificationsController {
    private readonly getNotificationsUseCase;
    private readonly markNotificationReadUseCase;
    private readonly markAllNotificationsReadUseCase;
    constructor(getNotificationsUseCase: GetNotificationsUseCase, markNotificationReadUseCase: MarkNotificationReadUseCase, markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase);
    getNotifications(user: any): Promise<import("../domain/entities/notification.entity").NotificationEntity[]>;
    markAllAsRead(user: any): Promise<void>;
    markAsRead(id: string): Promise<void>;
}
