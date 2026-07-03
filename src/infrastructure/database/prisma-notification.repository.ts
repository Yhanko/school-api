import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';

@Injectable()
export class PrismaNotificationRepository implements INotificationRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: NotificationEntity): Promise<NotificationEntity> {
    const created = await this.prisma.notification.create({
      data: {
        title: notification.title,
        description: notification.description,
        type: notification.type,
        priority: notification.priority,
        userId: notification.userId,
        institutionId: notification.institutionId,
        isRead: notification.isRead,
      },
    });

    return new NotificationEntity(
      created.id,
      created.title,
      created.description,
      created.type,
      created.priority,
      created.isRead,
      created.userId,
      created.institutionId,
      created.createdAt,
    );
  }

  async createMany(notifications: NotificationEntity[]): Promise<void> {
    if (notifications.length === 0) return;
    
    await this.prisma.notification.createMany({
      data: notifications.map(n => ({
        title: n.title,
        description: n.description,
        type: n.type,
        priority: n.priority,
        userId: n.userId,
        institutionId: n.institutionId,
        isRead: n.isRead,
      })),
    });
  }

  async findByUserId(userId: string, limit = 50): Promise<NotificationEntity[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: [
        { isRead: 'asc' },        // unread first
        { createdAt: 'desc' },    // then newest
      ],
      take: limit,
    });

    return notifications.map(n => new NotificationEntity(
      n.id,
      n.title,
      n.description,
      n.type,
      n.priority,
      n.isRead,
      n.userId,
      n.institutionId,
      n.createdAt,
    ));
  }

  async markAsRead(id: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
