import { Inject, Injectable } from '@nestjs/common';
import { IRoomRepository } from '../../domain/repositories/room.repository.interface';
import { CreateRoomDto } from '../../presentation/dtos/create-room.dto';
import { RoomEntity } from '../../domain/entities/room.entity';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';

@Injectable()
export class CreateRoomUseCase {
  constructor(
    @Inject(IRoomRepository)
    private readonly roomRepository: IRoomRepository,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  async execute(dto: CreateRoomDto, institutionId: string): Promise<RoomEntity> {
    const roomEntity = new RoomEntity(
      '',
      dto.name,
      dto.capacity,
      institutionId,
      dto.academicLevel,
      dto.grade,
      dto.floor,
    );
    const createdRoom = await this.roomRepository.create(roomEntity);

    await this.activityLogger.logAction(
      LogAction.CREATE_ROOM,
      'Room',
      `Created room ${createdRoom.name} (Capacity: ${createdRoom.capacity})`,
      undefined,
      institutionId
    );

    return createdRoom;
  }
}
