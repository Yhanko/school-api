import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  create(@Body() createResourceDto: any, @CurrentUser() user: any) {
    return this.resourcesService.create(createResourceDto, user.institutionId, user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT, Role.PARENT)
  findAll(@CurrentUser() user: any) {
    return this.resourcesService.findAll(user.institutionId, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.resourcesService.remove(id, user.institutionId);
  }
}
