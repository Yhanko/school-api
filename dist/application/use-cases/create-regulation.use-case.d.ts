import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { CreateRegulationDto } from '../../presentation/dtos/create-regulation.dto';
import { RegulationEntity } from '../../domain/entities/regulation.entity';
export declare class CreateRegulationUseCase {
    private readonly regulationRepository;
    constructor(regulationRepository: IRegulationRepository);
    execute(dto: CreateRegulationDto, authorId: string, institutionId: string): Promise<RegulationEntity>;
}
