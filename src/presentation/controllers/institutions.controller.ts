import { Controller, Post, Body, HttpCode, HttpStatus, Patch, UseGuards, Get } from '@nestjs/common';
import { CreateInstitutionUseCase } from '../../application/use-cases/create-institution.use-case';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';
import { JwtAuthGuard } from '../../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/security/roles.guard';
import { Roles } from '../../infrastructure/security/roles.decorator';
import { CurrentUser } from '../../infrastructure/security/current-user.decorator';
import { Role } from '../../domain/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('institutions')
export class InstitutionsController {
  constructor(
    private readonly createInstitutionUseCase: CreateInstitutionUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createInstitutionDto: CreateInstitutionDto) {
    return this.createInstitutionUseCase.execute(createInstitutionDto);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateMe(@CurrentUser() user: any, @Body() updateData: any) {
    return this.prisma.institution.update({
      where: { id: user.institutionId },
      data: updateData,
    });
  }

  @Get('me/subscription')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getMySubscription(@CurrentUser() user: any) {
    const institution = await this.prisma.institution.findUnique({
      where: { id: user.institutionId },
      include: {
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
    
    return {
      institutionStatus: institution?.status,
      currentSubscription: institution?.subscriptions[0] || null
    };
  }
}
