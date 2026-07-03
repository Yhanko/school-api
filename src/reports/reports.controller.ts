import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';
import { GenerateAcademicReportUseCase } from '../application/use-cases/generate-academic-report.use-case';
import { GenerateFinancialReportUseCase } from '../application/use-cases/generate-financial-report.use-case';
import { GenerateAdministrativeReportUseCase } from '../application/use-cases/generate-administrative-report.use-case';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.SECRETARY)
export class ReportsController {
  constructor(
    private readonly generateAcademicReportUseCase: GenerateAcademicReportUseCase,
    private readonly generateFinancialReportUseCase: GenerateFinancialReportUseCase,
    private readonly generateAdministrativeReportUseCase: GenerateAdministrativeReportUseCase,
  ) {}

  @Get('academic')
  getAcademicReport(@CurrentUser() user: any) {
    return this.generateAcademicReportUseCase.execute(user.institutionId);
  }

  @Get('financial')
  getFinancialReport(@CurrentUser() user: any) {
    return this.generateFinancialReportUseCase.execute(user.institutionId);
  }

  @Get('administrative')
  getAdministrativeReport(@CurrentUser() user: any) {
    return this.generateAdministrativeReportUseCase.execute(user.institutionId);
  }
}
