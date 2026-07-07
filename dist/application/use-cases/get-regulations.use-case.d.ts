import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { RegulationEntity, RegulationStatus } from '../../domain/entities/regulation.entity';
export declare class GetRegulationsUseCase {
    private readonly regulationRepository;
    constructor(regulationRepository: IRegulationRepository);
    execute(institutionId: string, status?: RegulationStatus): Promise<RegulationEntity[]>;
}
