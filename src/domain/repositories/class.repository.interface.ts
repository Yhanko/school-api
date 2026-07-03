import { ClassEntity } from '../entities/class.entity';

export const IClassRepository = Symbol('IClassRepository');

export interface IClassRepository {
  create(classData: ClassEntity, teacherIds: string[]): Promise<ClassEntity>;
  findById(id: string): Promise<ClassEntity | null>;
  findByInstitution(institutionId: string): Promise<ClassEntity[]>;
}
