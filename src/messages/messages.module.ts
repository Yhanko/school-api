import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { IMessageRepository } from '../domain/repositories/message.repository.interface';
import { PrismaMessageRepository } from '../infrastructure/database/prisma-message.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [MessagesController],
  providers: [
    SendMessageUseCase,
    {
      provide: IMessageRepository,
      useClass: PrismaMessageRepository,
    }
  ],
})
export class MessagesModule {}
