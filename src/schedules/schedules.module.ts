import { Module } from '@nestjs/common';
import { SchedulesController } from './schedules.controller';
import { CreateScheduleUseCase } from '../application/use-cases/create-schedule.use-case';
import { IScheduleRepository } from '../domain/repositories/schedule.repository.interface';
import { PrismaScheduleRepository } from '../infrastructure/database/prisma-schedule.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SchedulesController],
  providers: [
    CreateScheduleUseCase,
    {
      provide: IScheduleRepository,
      useClass: PrismaScheduleRepository,
    }
  ],
})
export class SchedulesModule {}
