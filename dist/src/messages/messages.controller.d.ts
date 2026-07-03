import { SendMessageDto } from '../presentation/dtos/send-message.dto';
import { SendMessageUseCase } from '../application/use-cases/send-message.use-case';
import { IMessageRepository } from '../domain/repositories/message.repository.interface';
export declare class MessagesController {
    private readonly sendMessageUseCase;
    private readonly messageRepository;
    constructor(sendMessageUseCase: SendMessageUseCase, messageRepository: IMessageRepository);
    sendMessage(dto: SendMessageDto, user: any): Promise<import("../domain/entities/message.entity").MessageEntity>;
    getConversation(userId: string, user: any): Promise<import("../domain/entities/message.entity").MessageEntity[]>;
    markAsRead(id: string): Promise<void>;
}
