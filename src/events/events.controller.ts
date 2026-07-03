import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CreateEventDto } from '../presentation/dtos/create-event.dto';
import { UpdateEventDto } from '../presentation/dtos/update-event.dto';
import { CreateEventUseCase } from '../application/use-cases/create-event.use-case';
import { GetEventsUseCase } from '../application/use-cases/get-events.use-case';
import { UpdateEventUseCase } from '../application/use-cases/update-event.use-case';
import { DeleteEventUseCase } from '../application/use-cases/delete-event.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly getEventsUseCase: GetEventsUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly deleteEventUseCase: DeleteEventUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SECRETARY, Role.ASSOCIATION_MEMBER)
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @CurrentUser() user: any,
  ) {
    return this.createEventUseCase.execute(createEventDto, user.institutionId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SECRETARY, Role.ASSOCIATION_MEMBER, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getEvents(
    @CurrentUser() user: any,
  ) {
    return this.getEventsUseCase.execute(user.institutionId);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.ASSOCIATION_MEMBER)
  updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @CurrentUser() user: any,
  ) {
    return this.updateEventUseCase.execute(id, updateEventDto, user.institutionId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.ASSOCIATION_MEMBER)
  deleteEvent(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ) {
    return this.deleteEventUseCase.execute(id, user.institutionId);
  }
}
