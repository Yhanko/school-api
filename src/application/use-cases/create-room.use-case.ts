import { Inject, Injectable } from '@nestjs/common';
import { IRoomRepository } from '../../domain/repositories/room.repository.interface';
import { CreateRoomDto } from '../../presentation/dtos/create-room.dto';
import { RoomEntity } from '../../domain/entities/room.entity';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(IRoomRepository)
    private readonly roomRepository: IRoomRepository,
  ) {}

  async execute(dto: CreateRoomDto, institutionId: string): Promise<RoomEntity> {
    const roomEntity = new RoomEntity(
      '',
      dto.name,
      dto.capacity,
      institutionId,
      dto.floor,
    );
    return this.roomRepository.create(roomEntity);
  }
}
