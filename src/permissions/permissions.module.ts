import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { GetUsersPermissionsUseCase } from '../application/use-cases/get-users-permissions.use-case';
import { UpdateUserPermissionsUseCase } from '../application/use-cases/update-user-permissions.use-case';
import { IPermissionRepository } from '../domain/repositories/permission.repository.interface';
import { PrismaPermissionRepository } from '../infrastructure/database/prisma-permission.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PermissionsController],
  providers: [
    GetUsersPermissionsUseCase,
    UpdateUserPermissionsUseCase,
    {
      provide: IPermissionRepository,
      useClass: PrismaPermissionRepository,
    },
  ],
})
export class PermissionsModule {}
