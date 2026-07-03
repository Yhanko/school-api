import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { DisciplinaryEntity } from '../../domain/entities/disciplinary.entity';
export declare class GetDisciplinaryRecordsUseCase {
    private readonly disciplinaryRepository;
    constructor(disciplinaryRepository: IDisciplinaryRepository);
    execute(institutionId: string, studentId?: string): Promise<DisciplinaryEntity[]>;
}
