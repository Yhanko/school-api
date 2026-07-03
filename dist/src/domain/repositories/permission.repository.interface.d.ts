import { PermissionEntity } from '../entities/permission.entity';
export declare const IPermissionRepository: unique symbol;
export interface IPermissionRepository {
    createDefault(userId: string, isSuperAdmin?: boolean): Promise<PermissionEntity>;
    findByUserId(userId: string): Promise<PermissionEntity | null>;
    findAllByInstitution(institutionId: string): Promise<any[]>;
    updateByUserId(userId: string, permissions: Partial<PermissionEntity>): Promise<PermissionEntity>;
}
