import { IMessageRepository } from '../../domain/repositories/message.repository.interface';
import { SendMessageDto } from '../../presentation/dtos/send-message.dto';
import { MessageEntity } from '../../domain/entities/message.entity';
import { PrismaService } from '../../prisma/prisma.service';
export declare class SendMessageUseCase {
    private readonly messageRepository;
    private readonly prisma;
    constructor(messageRepository: IMessageRepository, prisma: PrismaService);
    execute(senderId: string, dto: SendMessageDto, institutionId: string): Promise<MessageEntity>;
}
