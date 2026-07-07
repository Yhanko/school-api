import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
export declare class GetUsersPermissionsUseCase {
    private readonly permissionRepository;
    constructor(permissionRepository: IPermissionRepository);
    execute(institutionId: string): Promise<any[]>;
}
