import { Controller, Post, Get, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { CreateScheduleDto } from '../presentation/dtos/create-schedule.dto';
import { CreateScheduleUseCase } from '../application/use-cases/create-schedule.use-case';
import { IScheduleRepository } from '../domain/repositories/schedule.repository.interface';
import { Inject } from '@nestjs/common';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(
    private readonly createScheduleUseCase: CreateScheduleUseCase,
    @Inject(IScheduleRepository)
    private readonly scheduleRepository: IScheduleRepository,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SECRETARY)
  createSchedule(
    @Body() createScheduleDto: CreateScheduleDto,
    @CurrentUser() user: any,
  ) {
    return this.createScheduleUseCase.execute(createScheduleDto, user.institutionId);
  }

  @Get('class/:classId')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getSchedulesByClass(@Param('classId') classId: string) {
    return this.scheduleRepository.findByClass(classId);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SECRETARY)
  deleteSchedule(@Param('id') id: string) {
    return this.scheduleRepository.delete(id);
  }
}
