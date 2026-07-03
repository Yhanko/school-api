import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { MarkAttendanceDto } from '../presentation/dtos/mark-attendance.dto';
import { MarkAttendanceUseCase } from '../application/use-cases/mark-attendance.use-case';
import { GetStudentAttendanceUseCase } from '../application/use-cases/get-student-attendance.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    private readonly markAttendanceUseCase: MarkAttendanceUseCase,
    private readonly getStudentAttendanceUseCase: GetStudentAttendanceUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  markAttendance(
    @Body() markAttendanceDto: MarkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.markAttendanceUseCase.execute(markAttendanceDto, user.sub, user.institutionId);
  }

  @Get('student/:studentId/class/:classId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getStudentAttendance(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
    @CurrentUser() user: any,
  ) {
    return this.getStudentAttendanceUseCase.execute(studentId, classId, user.institutionId);
  }
}
