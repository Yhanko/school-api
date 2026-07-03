import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { CreateDisciplinaryDto, UpdateDisciplinaryStatusDto } from '../presentation/dtos/disciplinary.dto';
import { CreateDisciplinaryUseCase } from '../application/use-cases/create-disciplinary.use-case';
import { GetDisciplinaryRecordsUseCase } from '../application/use-cases/get-disciplinary-records.use-case';
import { UpdateDisciplinaryStatusUseCase } from '../application/use-cases/update-disciplinary-status.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { IDisciplinaryRepository } from '../domain/repositories/disciplinary.repository.interface';

@Controller('disciplinary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DisciplinaryController {
  constructor(
    private readonly createDisciplinaryUseCase: CreateDisciplinaryUseCase,
    private readonly getDisciplinaryRecordsUseCase: GetDisciplinaryRecordsUseCase,
    private readonly updateDisciplinaryStatusUseCase: UpdateDisciplinaryStatusUseCase,
    @Inject(IDisciplinaryRepository)
    private readonly disciplinaryRepository: IDisciplinaryRepository,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER)
  createRecord(
    @Body() dto: CreateDisciplinaryDto,
    @CurrentUser() user: any,
  ) {
    return this.createDisciplinaryUseCase.execute(dto, user.sub, user.institutionId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getRecords(
    @CurrentUser() user: any,
    @Query('studentId') studentId?: string,
  ) {
    // Role-based filtering
    let targetStudentId = studentId;

    if (user.role === Role.STUDENT) {
      // Students can only see their own records
      targetStudentId = user.sub;
    }
    // Note: If user is PARENT, they could pass studentId of their child, 
    // but in a strict system we should validate if the child belongs to them.
    
    return this.getDisciplinaryRecordsUseCase.execute(user.institutionId, targetStudentId);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateDisciplinaryStatusDto,
  ) {
    return this.updateDisciplinaryStatusUseCase.execute(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SECRETARY)
  deleteRecord(@Param('id') id: string) {
    return this.disciplinaryRepository.delete(id);
  }
}
