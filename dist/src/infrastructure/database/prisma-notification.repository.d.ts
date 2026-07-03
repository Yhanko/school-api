import { PrismaService } from '../../prisma/prisma.service';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';
export declare class PrismaNotificationRepository implements INotificationRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(notification: NotificationEntity): Promise<NotificationEntity>;
    createMany(notifications: NotificationEntity[]): Promise<void>;
    findByUserId(userId: string, limit?: number): Promise<NotificationEntity[]>;
    markAsRead(id: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}
