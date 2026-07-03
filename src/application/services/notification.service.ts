import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../../domain/repositories/notification.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { NotificationEntity } from '../../domain/entities/notification.entity';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class NotificationService {
  constructor(
    @Inject(INotificationRepository)
    private readonly notificationRepository: INotificationRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
  ) {}

  async notifyUser(
    userId: string,
    institutionId: string,
    title: string,
    description: string,
    type: string = 'info',
    priority: string = 'low',
  ): Promise<void> {
    const notification = new NotificationEntity(
      '',
      title,
      description,
      type,
      priority,
      false,
      userId,
      institutionId,
    );
    await this.notificationRepository.create(notification);
  }

  async notifyAdmins(
    institutionId: string,
    title: string,
    description: string,
    type: string = 'info',
    priority: string = 'low',
  ): Promise<void> {
    // Busca todos os administradores e secretários da instituição
    const users = await this.userRepository.findByInstitution(institutionId);
    const admins = users.filter((u: any) => u.role === Role.ADMIN || u.role === Role.SUPER_ADMIN || u.role === Role.SECRETARY);

    if (admins.length === 0) return;

    const notifications = admins.map((admin: any) => 
      new NotificationEntity(
        '',
        title,
        description,
        type,
        priority,
        false,
        admin.id,
        institutionId,
      )
    );

    await this.notificationRepository.createMany(notifications);
  }
}

