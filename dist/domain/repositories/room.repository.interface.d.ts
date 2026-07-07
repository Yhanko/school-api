import { RoomEntity } from '../entities/room.entity';
export declare const IRoomRepository: unique symbol;
export interface IRoomRepository {
    create(room: RoomEntity): Promise<RoomEntity>;
    findAllByInstitution(institutionId: string): Promise<RoomEntity[]>;
    findById(id: string): Promise<RoomEntity | null>;
}
