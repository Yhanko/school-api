import { MessageEntity } from '../entities/message.entity';
export declare const IMessageRepository: unique symbol;
export interface IMessageRepository {
    create(message: MessageEntity): Promise<MessageEntity>;
    findConversation(userId1: string, userId2: string): Promise<MessageEntity[]>;
    markAsRead(messageId: string): Promise<void>;
}
