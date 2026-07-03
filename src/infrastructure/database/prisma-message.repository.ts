import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IMessageRepository } from '../../domain/repositories/message.repository.interface';
import { MessageEntity } from '../../domain/entities/message.entity';

@Injectable()
export class PrismaMessageRepository implements IMessageRepository {
  constructor(private prisma: PrismaService) {}

  private mapToEntity(model: any): MessageEntity {
    return new MessageEntity(
      model.id,
      model.senderId,
      model.receiverId,
      model.content,
      model.read,
      model.institutionId,
      model.createdAt,
    );
  }

  async create(message: MessageEntity): Promise<MessageEntity> {
    const created = await this.prisma.message.create({
      data: {
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        read: message.read,
        institutionId: message.institutionId,
      },
    });
    return this.mapToEntity(created);
  }

  async findConversation(userId1: string, userId2: string): Promise<MessageEntity[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map((m) => this.mapToEntity(m));
  }

  async markAsRead(messageId: string): Promise<void> {
    await this.prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });
  }
}
