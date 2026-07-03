import { CreateRegulationDto } from '../presentation/dtos/create-regulation.dto';
import { CreateRegulationUseCase } from '../application/use-cases/create-regulation.use-case';
import { GetRegulationsUseCase } from '../application/use-cases/get-regulations.use-case';
import { PublishRegulationUseCase } from '../application/use-cases/publish-regulation.use-case';
import { IRegulationRepository } from '../domain/repositories/regulation.repository.interface';
export declare class RegulationsController {
    private readonly createRegulationUseCase;
    private readonly getRegulationsUseCase;
    private readonly publishRegulationUseCase;
    private readonly regulationRepository;
    constructor(createRegulationUseCase: CreateRegulationUseCase, getRegulationsUseCase: GetRegulationsUseCase, publishRegulationUseCase: PublishRegulationUseCase, regulationRepository: IRegulationRepository);
    createRegulation(dto: CreateRegulationDto, user: any): Promise<import("../domain/entities/regulation.entity").RegulationEntity>;
    getRegulations(user: any): Promise<import("../domain/entities/regulation.entity").RegulationEntity[]>;
    getRegulationById(id: string): Promise<import("../domain/entities/regulation.entity").RegulationEntity | null>;
    publishRegulation(id: string): Promise<import("../domain/entities/regulation.entity").RegulationEntity>;
    deleteRegulation(id: string): Promise<void>;
}
