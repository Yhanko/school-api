import { RegulationEntity, RegulationStatus } from '../entities/regulation.entity';
export declare const IRegulationRepository: unique symbol;
export interface IRegulationRepository {
    create(regulation: RegulationEntity): Promise<RegulationEntity>;
    findAllByInstitution(institutionId: string, status?: RegulationStatus): Promise<RegulationEntity[]>;
    findById(id: string): Promise<RegulationEntity | null>;
    updateStatus(id: string, status: RegulationStatus): Promise<RegulationEntity>;
    delete(id: string): Promise<void>;
}
