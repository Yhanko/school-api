import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { CreateGradeDto } from '../presentation/dtos/create-grade.dto';
import { CreateGradeUseCase } from '../application/use-cases/create-grade.use-case';
import { GetStudentGradesUseCase } from '../application/use-cases/get-student-grades.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('grades')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradesController {
  constructor(
    private readonly createGradeUseCase: CreateGradeUseCase,
    private readonly getStudentGradesUseCase: GetStudentGradesUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  createGrade(
    @Body() createGradeDto: CreateGradeDto,
    @CurrentUser() user: any,
  ) {
    return this.createGradeUseCase.execute(createGradeDto, user.sub, user.institutionId);
  }

  @Get('student/:studentId/class/:classId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getStudentGrades(
    @Param('studentId') studentId: string,
    @Param('classId') classId: string,
    @CurrentUser() user: any,
  ) {
    // A STUDENT/PARENT could have an extra check here to ensure they only view their own grades.
    return this.getStudentGradesUseCase.execute(studentId, classId, user.institutionId);
  }
}
