import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { InstitutionEntity } from '../../domain/entities/institution.entity';
import { CreateInstitutionDto } from '../../presentation/dtos/create-institution.dto';
export declare class CreateInstitutionUseCase {
    private readonly institutionRepository;
    constructor(institutionRepository: IInstitutionRepository);
    execute(dto: CreateInstitutionDto): Promise<InstitutionEntity>;
}
