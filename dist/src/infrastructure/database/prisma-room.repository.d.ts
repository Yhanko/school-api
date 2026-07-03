import { PrismaService } from '../../prisma/prisma.service';
import { IRoomRepository } from '../../domain/repositories/room.repository.interface';
import { RoomEntity } from '../../domain/entities/room.entity';
export declare class PrismaRoomRepository implements IRoomRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(room: RoomEntity): Promise<RoomEntity>;
    findAllByInstitution(institutionId: string): Promise<RoomEntity[]>;
    findById(id: string): Promise<RoomEntity | null>;
}
