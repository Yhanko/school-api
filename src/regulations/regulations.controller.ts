import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Inject } from '@nestjs/common';
import { CreateRegulationDto } from '../presentation/dtos/create-regulation.dto';
import { CreateRegulationUseCase } from '../application/use-cases/create-regulation.use-case';
import { GetRegulationsUseCase } from '../application/use-cases/get-regulations.use-case';
import { PublishRegulationUseCase } from '../application/use-cases/publish-regulation.use-case';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { IRegulationRepository } from '../domain/repositories/regulation.repository.interface';
import { RegulationStatus } from '../domain/entities/regulation.entity';

@Controller('regulations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegulationsController {
  constructor(
    private readonly createRegulationUseCase: CreateRegulationUseCase,
    private readonly getRegulationsUseCase: GetRegulationsUseCase,
    private readonly publishRegulationUseCase: PublishRegulationUseCase,
    @Inject(IRegulationRepository)
    private readonly regulationRepository: IRegulationRepository,
  ) {}

  @Post()
  @Roles(Role.ADMIN, Role.SECRETARY)
  createRegulation(
    @Body() dto: CreateRegulationDto,
    @CurrentUser() user: any,
  ) {
    return this.createRegulationUseCase.execute(dto, user.sub, user.institutionId);
  }

  @Get()
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getRegulations(@CurrentUser() user: any) {
    // If Admin/Secretary, they can see ALL regulations (DRAFT and PUBLISHED)
    // If Student/Teacher/Parent, they can only see PUBLISHED regulations
    let filterStatus: RegulationStatus | undefined = undefined;

    if ([Role.STUDENT, Role.PARENT, Role.TEACHER].includes(user.role)) {
      filterStatus = RegulationStatus.PUBLISHED;
    }

    return this.getRegulationsUseCase.execute(user.institutionId, filterStatus);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.SECRETARY, Role.TEACHER, Role.STUDENT, Role.PARENT)
  getRegulationById(@Param('id') id: string) {
    // Note: Should also protect against seeing DRAFTs if not admin, but simplifying for now
    return this.regulationRepository.findById(id);
  }

  @Patch(':id/publish')
  @Roles(Role.ADMIN, Role.SECRETARY)
  publishRegulation(@Param('id') id: string) {
    return this.publishRegulationUseCase.execute(id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.SECRETARY)
  deleteRegulation(@Param('id') id: string) {
    return this.regulationRepository.delete(id);
  }
}
