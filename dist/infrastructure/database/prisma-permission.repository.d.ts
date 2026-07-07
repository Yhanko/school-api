import { PrismaService } from '../../prisma/prisma.service';
import { IPermissionRepository } from '../../domain/repositories/permission.repository.interface';
import { PermissionEntity } from '../../domain/entities/permission.entity';
export declare class PrismaPermissionRepository implements IPermissionRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    createDefault(userId: string, isSuperAdmin?: boolean): Promise<PermissionEntity>;
    findByUserId(userId: string): Promise<PermissionEntity | null>;
    findAllByInstitution(institutionId: string): Promise<any[]>;
    updateByUserId(userId: string, permissions: Partial<PermissionEntity>): Promise<PermissionEntity>;
}
