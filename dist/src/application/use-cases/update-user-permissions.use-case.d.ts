import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { UpdateUserPermissionsDto } from '../../presentation/dtos/update-user-permissions.dto';
import { PermissionEntity } from '../../domain/entities/permission.entity';
export declare class UpdateUserPermissionsUseCase {
    private readonly permissionRepository;
    constructor(permissionRepository: IPermissionRepository);
    execute(userId: string, dto: UpdateUserPermissionsDto): Promise<PermissionEntity>;
}
