import { Controller, Get, UseGuards } from '@nestjs/common';
import { AcademicYearsService } from './academic-years.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Get('active')
  @UseGuards(JwtAuthGuard)
  getActiveYear(@CurrentUser() user: any) {
    return this.academicYearsService.getActiveYear(user.institutionId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: any) {
    return this.academicYearsService.findAll(user.institutionId);
  }
}
