import { EventEntity } from '../entities/event.entity';
export declare const IEventRepository: unique symbol;
export interface IEventRepository {
    create(event: EventEntity): Promise<EventEntity>;
    findAllByInstitution(institutionId: string): Promise<EventEntity[]>;
    findById(id: string): Promise<EventEntity | null>;
    update(id: string, data: Partial<EventEntity>): Promise<EventEntity>;
    delete(id: string): Promise<void>;
}
