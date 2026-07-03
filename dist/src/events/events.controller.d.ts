import { CreateEventDto } from '../presentation/dtos/create-event.dto';
import { UpdateEventDto } from '../presentation/dtos/update-event.dto';
import { CreateEventUseCase } from '../application/use-cases/create-event.use-case';
import { GetEventsUseCase } from '../application/use-cases/get-events.use-case';
import { UpdateEventUseCase } from '../application/use-cases/update-event.use-case';
import { DeleteEventUseCase } from '../application/use-cases/delete-event.use-case';
export declare class EventsController {
    private readonly createEventUseCase;
    private readonly getEventsUseCase;
    private readonly updateEventUseCase;
    private readonly deleteEventUseCase;
    constructor(createEventUseCase: CreateEventUseCase, getEventsUseCase: GetEventsUseCase, updateEventUseCase: UpdateEventUseCase, deleteEventUseCase: DeleteEventUseCase);
    createEvent(createEventDto: CreateEventDto, user: any): Promise<import("../domain/entities/event.entity").EventEntity>;
    getEvents(user: any): Promise<import("../domain/entities/event.entity").EventEntity[]>;
    updateEvent(id: string, updateEventDto: UpdateEventDto, user: any): Promise<import("../domain/entities/event.entity").EventEntity>;
    deleteEvent(id: string, user: any): Promise<void>;
}
