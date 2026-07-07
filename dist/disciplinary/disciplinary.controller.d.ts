import { CreateDisciplinaryDto, UpdateDisciplinaryStatusDto } from '../presentation/dtos/disciplinary.dto';
import { CreateDisciplinaryUseCase } from '../application/use-cases/create-disciplinary.use-case';
import { GetDisciplinaryRecordsUseCase } from '../application/use-cases/get-disciplinary-records.use-case';
import { UpdateDisciplinaryStatusUseCase } from '../application/use-cases/update-disciplinary-status.use-case';
import { IDisciplinaryRepository } from '../domain/repositories/disciplinary.repository.interface';
export declare class DisciplinaryController {
    private readonly createDisciplinaryUseCase;
    private readonly getDisciplinaryRecordsUseCase;
    private readonly updateDisciplinaryStatusUseCase;
    private readonly disciplinaryRepository;
    constructor(createDisciplinaryUseCase: CreateDisciplinaryUseCase, getDisciplinaryRecordsUseCase: GetDisciplinaryRecordsUseCase, updateDisciplinaryStatusUseCase: UpdateDisciplinaryStatusUseCase, disciplinaryRepository: IDisciplinaryRepository);
    createRecord(dto: CreateDisciplinaryDto, user: any): Promise<import("../domain/entities/disciplinary.entity").DisciplinaryEntity>;
    getRecords(user: any, studentId?: string): Promise<import("../domain/entities/disciplinary.entity").DisciplinaryEntity[]>;
    updateStatus(id: string, dto: UpdateDisciplinaryStatusDto): Promise<import("../domain/entities/disciplinary.entity").DisciplinaryEntity>;
    deleteRecord(id: string): Promise<void>;
}
