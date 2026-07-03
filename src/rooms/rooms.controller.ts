import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CreateRoomDto } from '../presentation/dtos/create-room.dto';
import { CreateRoomUseCase } from '../application/use-cases/create-room.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(
    private readonly createRoomUseCase: CreateRoomUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SECRETARY)
  createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @CurrentUser() user: any,
  ) {
    return this.createRoomUseCase.execute(createRoomDto, user.institutionId);
  }

  // Get rooms would go here
}
