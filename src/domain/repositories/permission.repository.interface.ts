import { PermissionEntity } from '../entities/permission.entity';

export const IPermissionRepository = Symbol('IPermissionRepository');

export interface IPermissionRepository {
  createDefault(userId: string, isSuperAdmin?: boolean): Promise<PermissionEntity>;
  findByUserId(userId: string): Promise<PermissionEntity | null>;
  findAllByInstitution(institutionId: string): Promise<any[]>; // returns users with permissions
  updateByUserId(userId: string, permissions: Partial<PermissionEntity>): Promise<PermissionEntity>;
}
