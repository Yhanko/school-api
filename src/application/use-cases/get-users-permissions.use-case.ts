import { Inject, Injectable } from '@nestjs/common';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';

@Injectable()
export class GetUsersPermissionsUseCase {
  constructor(
    @Inject(IPermissionRepository)
    private readonly permissionRepository: IPermissionRepository,
  ) {}

  async execute(institutionId: string): Promise<any[]> {
    return this.permissionRepository.findAllByInstitution(institutionId);
  }
}
