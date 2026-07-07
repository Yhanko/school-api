import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { InstitutionEntity } from '../../domain/entities/institution.entity';
import { PrismaService } from '../../prisma/prisma.service';
export declare class PrismaInstitutionRepository implements IInstitutionRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<InstitutionEntity | null>;
    create(institution: InstitutionEntity): Promise<InstitutionEntity>;
}
