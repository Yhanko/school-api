import { IEventRepository } from '../../domain/repositories/event.repository.interface';
export declare class DeleteEventUseCase {
    private readonly eventRepository;
    constructor(eventRepository: IEventRepository);
    execute(id: string, institutionId: string): Promise<void>;
}
