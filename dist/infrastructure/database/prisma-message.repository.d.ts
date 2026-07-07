import { PrismaService } from '../../prisma/prisma.service';
import { IMessageRepository } from '../../domain/repositories/message.repository.interface';
import { MessageEntity } from '../../domain/entities/message.entity';
export declare class PrismaMessageRepository implements IMessageRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(message: MessageEntity): Promise<MessageEntity>;
    findConversation(userId1: string, userId2: string): Promise<MessageEntity[]>;
    markAsRead(messageId: string): Promise<void>;
}
