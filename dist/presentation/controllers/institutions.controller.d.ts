import { CreateInstitutionUseCase } from '../../application/use-cases/create-institution.use-case';
import { CreateInstitutionDto } from '../dtos/create-institution.dto';
export declare class InstitutionsController {
    private readonly createInstitutionUseCase;
    constructor(createInstitutionUseCase: CreateInstitutionUseCase);
    create(createInstitutionDto: CreateInstitutionDto): Promise<import("../../domain/entities/institution.entity").InstitutionEntity>;
}
