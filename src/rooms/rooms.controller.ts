import { Controller, Post, Get, Body, UseGuards, Query, Inject } from '@nestjs/common';
import { CreateRoomDto } from '../presentation/dtos/create-room.dto';
import { CreateRoomUseCase } from '../application/use-cases/create-room.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { IRoomRepository } from '../domain/repositories/room.repository.interface';

@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
    @Inject(IRoomRepository) private readonly roomRepository: IRoomRepository,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SECRETARY)
  createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @CurrentUser() user: any,
  ) {
    return this.createRoomUseCase.execute(createRoomDto, user.institutionId);
  }

  @Get()
  async getRooms(
    @CurrentUser() user: any,
    @Query('academicLevel') academicLevel?: string,
    @Query('grade') grade?: string,
  ) {
    const rooms = await this.roomRepository.findAllByInstitution(user.institutionId);
    
    return rooms.filter(room => {
      let matches = true;
      if (academicLevel) {
        matches = matches && room.academicLevel === academicLevel;
      }
      if (grade) {
        // If a room is locked to a specific grade, it must match.
        // If a room has NO grade (null/undefined), it's considered available for ALL grades within the academicLevel.
        if (room.grade) {
          matches = matches && room.grade === grade;
        }
      }
      return matches;
    });
  }
}
