import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { GetUsersPermissionsUseCase } from '../application/use-cases/get-users-permissions.use-case';
import { UpdateUserPermissionsUseCase } from '../application/use-cases/update-user-permissions.use-case';
import { UpdateUserPermissionsDto } from '../presentation/dtos/update-user-permissions.dto';
import { JwtAuthGuard } from '../infrastructure/security/jwt-auth.guard';
import { RolesGuard } from '../infrastructure/security/roles.guard';
import { Roles } from '../infrastructure/security/roles.decorator';
import { Role } from '../domain/entities/user.entity';
import { CurrentUser } from '../infrastructure/security/current-user.decorator';

@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionsController {
  constructor(
    private readonly getUsersPermissionsUseCase: GetUsersPermissionsUseCase,
    private readonly updateUserPermissionsUseCase: UpdateUserPermissionsUseCase,
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  getUsersPermissions(@CurrentUser() user: any) {
    return this.getUsersPermissionsUseCase.execute(user.institutionId);
  }

  @Patch(':userId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  updateUserPermissions(
    @Param('userId') userId: string,
    @Body() dto: UpdateUserPermissionsDto,
  ) {
    return this.updateUserPermissionsUseCase.execute(userId, dto);
  }
}
