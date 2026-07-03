import { NotificationEntity } from '../entities/notification.entity';

export const INotificationRepository = Symbol('INotificationRepository');

export interface INotificationRepository {
  create(notification: NotificationEntity): Promise<NotificationEntity>;
  createMany(notifications: NotificationEntity[]): Promise<void>;
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
