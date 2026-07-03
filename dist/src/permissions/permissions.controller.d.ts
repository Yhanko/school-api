import { GetUsersPermissionsUseCase } from '../application/use-cases/get-users-permissions.use-case';
import { UpdateUserPermissionsUseCase } from '../application/use-cases/update-user-permissions.use-case';
import { UpdateUserPermissionsDto } from '../presentation/dtos/update-user-permissions.dto';
export declare class PermissionsController {
    private readonly getUsersPermissionsUseCase;
    private readonly updateUserPermissionsUseCase;
    constructor(getUsersPermissionsUseCase: GetUsersPermissionsUseCase, updateUserPermissionsUseCase: UpdateUserPermissionsUseCase);
    getUsersPermissions(user: any): Promise<any[]>;
    updateUserPermissions(userId: string, dto: UpdateUserPermissionsDto): Promise<import("../domain/entities/permission.entity").PermissionEntity>;
}
