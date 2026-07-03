import { Controller, Post, Body, Get, Param, UseGuards, Query } from '@nestjs/common';
import { CreateClassDto } from '../presentation/dtos/create-class.dto';
import { CreateClassUseCase } from '../application/use-cases/create-class.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { EnrollStudentUseCase } from '../application/use-cases/enroll-student.use-case';

@Controller('classes')
export class ClassesController {
  constructor(
    private readonly createClassUseCase: CreateClassUseCase,
    private readonly enrollStudentUseCase: EnrollStudentUseCase,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER)
  getClasses(@CurrentUser() user: any) {
    return this.createClassUseCase.executeGetByInstitution(user.institutionId);
  }

  @Get('teacher/:teacherId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  getClassesByTeacher(
    @Param('teacherId') teacherId: string,
    @CurrentUser() user: any,
  ) {
    // Delegate to use case — returns classes where teacher is assigned
    return this.createClassUseCase.executeGetByTeacher(teacherId, user.institutionId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getClassById(@Param('id') id: string) {
    return this.createClassUseCase.executeGetById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SECRETARY)
  createClass(
    @Body() createClassDto: CreateClassDto,
    @CurrentUser() user: any,
  ) {
    return this.createClassUseCase.execute(createClassDto, user.institutionId);
  }

  @Post(':id/enroll/:studentId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SECRETARY)
  enrollStudent(
    @Param('id') classId: string,
    @Param('studentId') studentId: string,
    @CurrentUser() user: any,
  ) {
    return this.enrollStudentUseCase.execute(classId, studentId, user.institutionId);
  }

  // Future endpoints (e.g. GET /classes) could go here
}
