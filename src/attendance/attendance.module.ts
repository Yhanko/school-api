import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { MarkAttendanceUseCase } from '../application/use-cases/mark-attendance.use-case';
import { GetStudentAttendanceUseCase } from '../application/use-cases/get-student-attendance.use-case';
import { IAttendanceRepository } from '../domain/repositories/attendance.repository.interface';
import { PrismaAttendanceRepository } from '../infrastructure/database/prisma-attendance.repository';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { PrismaUserRepository } from '../infrastructure/database/prisma-user.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttendanceController],
  providers: [
    MarkAttendanceUseCase,
    GetStudentAttendanceUseCase,
    {
      provide: IAttendanceRepository,
      useClass: PrismaAttendanceRepository,
    },
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    }
  ],
})
export class AttendanceModule {}
