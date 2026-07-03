import { IRoomRepository } from '../../domain/repositories/room.repository.interface';
import { CreateRoomDto } from '../../presentation/dtos/create-room.dto';
import { RoomEntity } from '../../domain/entities/room.entity';
export declare class CreateRoomUseCase {
    private readonly roomRepository;
    constructor(roomRepository: IRoomRepository);
    execute(dto: CreateRoomDto, institutionId: string): Promise<RoomEntity>;
}
