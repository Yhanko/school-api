import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';

@Controller('settings')
export class GlobalSettingsController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Get()
  async getSettings() {
    return this.superAdminService.getGlobalSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async updateSettings(@Body() body: any) {
    return this.superAdminService.updateGlobalSettings(body);
  }
}
