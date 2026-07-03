import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { UpdateUserPermissionsDto } from '../../presentation/dtos/update-user-permissions.dto';
import { PermissionEntity } from '../../domain/entities/permission.entity';

@Injectable()
export class UpdateUserPermissionsUseCase {
  constructor(
    @Inject(IPermissionRepository)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(userId: string, dto: UpdateUserPermissionsDto): Promise<PermissionEntity> {
    return this.permissionRepository.updateByUserId(userId, dto as Partial<PermissionEntity>);
  }
}
