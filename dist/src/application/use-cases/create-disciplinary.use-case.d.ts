import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { CreateDisciplinaryDto } from '../../presentation/dtos/disciplinary.dto';
import { DisciplinaryEntity } from '../../domain/entities/disciplinary.entity';
export declare class CreateDisciplinaryUseCase {
    private readonly disciplinaryRepository;
    constructor(disciplinaryRepository: IDisciplinaryRepository);
    execute(dto: CreateDisciplinaryDto, reportedById: string, institutionId: string): Promise<DisciplinaryEntity>;
}
