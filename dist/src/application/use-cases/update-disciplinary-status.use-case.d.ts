import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { DisciplinaryEntity } from '../../domain/entities/disciplinary.entity';
import { UpdateDisciplinaryStatusDto } from '../../presentation/dtos/disciplinary.dto';
export declare class UpdateDisciplinaryStatusUseCase {
    private readonly disciplinaryRepository;
    constructor(disciplinaryRepository: IDisciplinaryRepository);
    execute(id: string, dto: UpdateDisciplinaryStatusDto): Promise<DisciplinaryEntity>;
}
