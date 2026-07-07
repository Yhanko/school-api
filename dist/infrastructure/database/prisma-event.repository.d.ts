import { PrismaService } from '../../prisma/prisma.service';
import { IEventRepository } from '../../domain/repositories/event.repository.interface';
import { EventEntity } from '../../domain/entities/event.entity';
export declare class PrismaEventRepository implements IEventRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(event: EventEntity): Promise<EventEntity>;
    findAllByInstitution(institutionId: string): Promise<EventEntity[]>;
    findById(id: string): Promise<EventEntity | null>;
    update(id: string, data: Partial<EventEntity>): Promise<EventEntity>;
    delete(id: string): Promise<void>;
}
