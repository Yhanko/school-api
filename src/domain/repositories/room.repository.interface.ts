import { RoomEntity } from '../entities/room.entity';

export const IRoomRepository = Symbol('IRoomRepository');

export interface IRoomRepository {
  create(room: RoomEntity): Promise<RoomEntity>;
  findAllByInstitution(institutionId: string): Promise<RoomEntity[]>;
  findById(id: string): Promise<RoomEntity | null>;
}
