import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PrismaUserRepository implements IUserRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: string): Promise<UserEntity | null>;
    findByInstitution(institutionId: string): Promise<UserEntity[]>;
    create(user: UserEntity): Promise<UserEntity>;
    update(id: string, data: Partial<UserEntity>): Promise<UserEntity>;
}
