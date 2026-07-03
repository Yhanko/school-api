import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { UpdateEventDto } from '../../presentation/dtos/update-event.dto';
import { EventEntity } from '../../domain/entities/event.entity';
export declare class UpdateEventUseCase {
    private readonly eventRepository;
    constructor(eventRepository: IEventRepository);
    execute(id: string, dto: UpdateEventDto, institutionId: string): Promise<EventEntity>;
}
