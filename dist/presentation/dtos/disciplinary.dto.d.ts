import { SeverityLevel, DisciplinaryStatus } from '../../domain/entities/disciplinary.entity';
export declare class CreateDisciplinaryDto {
    studentId: string;
    type: string;
    severity: SeverityLevel;
    status?: DisciplinaryStatus;
    description: string;
    date?: Date;
}
export declare class UpdateDisciplinaryStatusDto {
    status: DisciplinaryStatus;
}
