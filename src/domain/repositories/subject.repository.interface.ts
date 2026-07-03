import { SubjectEntity } from '../entities/subject.entity';

export const ISubjectRepository = Symbol('ISubjectRepository');

export interface ISubjectRepository {
  create(subject: SubjectEntity): Promise<SubjectEntity>;
  findAllByInstitution(institutionId: string): Promise<SubjectEntity[]>;
  findById(id: string): Promise<SubjectEntity | null>;
  findByStudent(studentId: string): Promise<SubjectEntity[]>;
  delete(id: string): Promise<void>;
}
