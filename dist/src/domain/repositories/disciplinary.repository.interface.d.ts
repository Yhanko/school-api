import { DisciplinaryEntity, DisciplinaryStatus } from '../entities/disciplinary.entity';
export declare const IDisciplinaryRepository: unique symbol;
export interface IDisciplinaryRepository {
    create(record: DisciplinaryEntity): Promise<DisciplinaryEntity>;
    findAll(institutionId: string, studentId?: string): Promise<DisciplinaryEntity[]>;
    findById(id: string): Promise<DisciplinaryEntity | null>;
    updateStatus(id: string, status: DisciplinaryStatus): Promise<DisciplinaryEntity>;
    delete(id: string): Promise<void>;
}
