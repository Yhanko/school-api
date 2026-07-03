import { PrismaService } from '../../prisma/prisma.service';
import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { RegulationEntity, RegulationStatus } from '../../domain/entities/regulation.entity';
export declare class PrismaRegulationRepository implements IRegulationRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(regulation: RegulationEntity): Promise<RegulationEntity>;
    findAllByInstitution(institutionId: string, status?: RegulationStatus): Promise<RegulationEntity[]>;
    findById(id: string): Promise<RegulationEntity | null>;
    updateStatus(id: string, status: RegulationStatus): Promise<RegulationEntity>;
    delete(id: string): Promise<void>;
}
