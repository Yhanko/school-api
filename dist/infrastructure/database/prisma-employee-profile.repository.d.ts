import { PrismaService } from '../../prisma/prisma.service';
import { IEmployeeProfileRepository } from '../../domain/repositories/employee-profile.repository.interface';
import { EmployeeProfileEntity } from '../../domain/entities/employee-profile.entity';
export declare class PrismaEmployeeProfileRepository implements IEmployeeProfileRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(profile: EmployeeProfileEntity): Promise<EmployeeProfileEntity>;
    findByUserId(userId: string): Promise<EmployeeProfileEntity | null>;
    update(userId: string, data: Partial<EmployeeProfileEntity>): Promise<EmployeeProfileEntity>;
}
