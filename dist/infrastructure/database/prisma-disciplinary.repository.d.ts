import { PrismaService } from '../../prisma/prisma.service';
import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { DisciplinaryEntity, DisciplinaryStatus } from '../../domain/entities/disciplinary.entity';
export declare class PrismaDisciplinaryRepository implements IDisciplinaryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(record: DisciplinaryEntity): Promise<DisciplinaryEntity>;
    findAll(institutionId: string, studentId?: string): Promise<DisciplinaryEntity[]>;
    findById(id: string): Promise<DisciplinaryEntity | null>;
    updateStatus(id: string, status: DisciplinaryStatus): Promise<DisciplinaryEntity>;
    delete(id: string): Promise<void>;
}
