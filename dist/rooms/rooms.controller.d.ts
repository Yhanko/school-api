import { CreateRoomDto } from '../presentation/dtos/create-room.dto';
import { CreateRoomUseCase } from '../application/use-cases/create-room.use-case';
export declare class RoomsController {
    private readonly createRoomUseCase;
    constructor(createRoomUseCase: CreateRoomUseCase);
    createRoom(createRoomDto: CreateRoomDto, user: any): Promise<import("../domain/entities/room.entity").RoomEntity>;
}
