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

  async findInbox(userId: string): Promise<any[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        sender: { select: { id: true, name: true, role: true } },
        receiver: { select: { id: true, name: true, role: true } },
      },
    });

    const inboxMap = new Map<string, any>();
    
    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!otherUser) continue;
      
      if (!inboxMap.has(otherUser.id)) {
        inboxMap.set(otherUser.id, {
          contact: otherUser,
          lastMessage: {
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            read: msg.read,
            isSender: msg.senderId === userId
          }
        });
      }
    }

    return Array.from(inboxMap.values());
  }
}
