import { Inject, Injectable } from '@nestjs/common';
import { IMessageRepository } from '../../domain/repositories/message.repository.interface';
import { SendMessageDto } from '../../presentation/dtos/send-message.dto';
import { MessageEntity } from '../../domain/entities/message.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(IMessageRepository)
    private readonly messageRepository: IMessageRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(senderId: string, dto: SendMessageDto, institutionId: string): Promise<MessageEntity> {
    const messageEntity = new MessageEntity(
      '',
      senderId,
      dto.receiverId,
      dto.content,
      false, // read
      institutionId,
    );
    const createdMessage = await this.messageRepository.create(messageEntity);

    // 🔔 Notify the receiver with sender's name and message preview
    try {
      const sender = await this.prisma.user.findUnique({
        where: { id: senderId },
        select: { name: true },
      });

      const senderName = sender?.name || 'Alguém';
      const preview = dto.content.length > 60 ? `${dto.content.substring(0, 60)}...` : dto.content;

      await this.prisma.notification.create({
        data: {
          userId: dto.receiverId,
          title: `💬 Nova Mensagem de ${senderName}`,
          description: `"${preview}"`,
          institutionId,
        },
      });
    } catch (e) {
      console.warn('Failed to send message notification:', e);
    }

    return createdMessage;
  }
}
