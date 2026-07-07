import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { RegulationEntity } from '../../domain/entities/regulation.entity';
export declare class PublishRegulationUseCase {
    private readonly regulationRepository;
    constructor(regulationRepository: IRegulationRepository);
    execute(id: string): Promise<RegulationEntity>;
}
