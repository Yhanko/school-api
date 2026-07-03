import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { GenerateAcademicReportUseCase } from '../application/use-cases/generate-academic-report.use-case';
import { GenerateFinancialReportUseCase } from '../application/use-cases/generate-financial-report.use-case';
import { GenerateAdministrativeReportUseCase } from '../application/use-cases/generate-administrative-report.use-case';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
  providers: [
    GenerateAcademicReportUseCase,
    GenerateFinancialReportUseCase,
    GenerateAdministrativeReportUseCase,
  ],
})
export class ReportsModule {}
