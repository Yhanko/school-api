import { PrismaService } from '../../prisma/prisma.service';
import { IClassRepository } from '../../domain/repositories/class.repository.interface';
import { ClassEntity } from '../../domain/entities/class.entity';
export declare class PrismaClassRepository implements IClassRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(classData: ClassEntity, teacherIds: string[]): Promise<ClassEntity>;
    findById(id: string): Promise<ClassEntity | null>;
    findByInstitution(institutionId: string): Promise<ClassEntity[]>;
}
