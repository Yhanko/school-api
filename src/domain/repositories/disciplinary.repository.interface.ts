import { DisciplinaryEntity, DisciplinaryStatus } from '../entities/disciplinary.entity';

export const IDisciplinaryRepository = Symbol('IDisciplinaryRepository');

export interface IDisciplinaryRepository {
  create(record: DisciplinaryEntity): Promise<DisciplinaryEntity>;
  findAll(institutionId: string, studentId?: string): Promise<DisciplinaryEntity[]>;
  findById(id: string): Promise<DisciplinaryEntity | null>;
  updateStatus(id: string, status: DisciplinaryStatus): Promise<DisciplinaryEntity>;
  delete(id: string): Promise<void>;
}
