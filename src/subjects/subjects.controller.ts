import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CreateSubjectDto } from '../presentation/dtos/create-subject.dto';
import { CreateSubjectUseCase } from '../application/use-cases/create-subject.use-case';
import { GetSubjectsUseCase } from '../application/use-cases/get-subjects.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubjectsController {
  constructor(
    private readonly createSubjectUseCase: CreateSubjectUseCase,
    private readonly getSubjectsUseCase: GetSubjectsUseCase,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SECRETARY, Role.PEDAGOGICAL_DIRECTOR)
  createSubject(
    @Body() createSubjectDto: CreateSubjectDto,
    @CurrentUser() user: any,
  ) {
    return this.createSubjectUseCase.execute(createSubjectDto, user.institutionId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER, Role.STUDENT, Role.PARENT, Role.PEDAGOGICAL_DIRECTOR)
  getSubjects(
    @CurrentUser() user: any,
  ) {
    return this.getSubjectsUseCase.execute(user.institutionId, user.sub, user.role);
  }
}
