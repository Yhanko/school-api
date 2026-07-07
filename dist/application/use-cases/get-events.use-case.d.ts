import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { EventEntity } from '../../domain/entities/event.entity';
export declare class GetEventsUseCase {
    private readonly eventRepository;
    constructor(eventRepository: IEventRepository);
    execute(institutionId: string): Promise<EventEntity[]>;
}
