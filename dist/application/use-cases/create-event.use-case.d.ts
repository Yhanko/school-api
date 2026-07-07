import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { CreateEventDto } from '../../presentation/dtos/create-event.dto';
import { EventEntity } from '../../domain/entities/event.entity';
import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateEventUseCase {
    private readonly eventRepository;
    private readonly prisma;
    constructor(eventRepository: IEventRepository, prisma: PrismaService);
    execute(dto: CreateEventDto, institutionId: string): Promise<EventEntity>;
}
