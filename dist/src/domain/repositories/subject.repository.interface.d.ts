import { SubjectEntity } from '../entities/subject.entity';
export declare const ISubjectRepository: unique symbol;
export interface ISubjectRepository {
    create(subject: SubjectEntity): Promise<SubjectEntity>;
    findAllByInstitution(institutionId: string): Promise<SubjectEntity[]>;
    findById(id: string): Promise<SubjectEntity | null>;
    findByStudent(studentId: string): Promise<SubjectEntity[]>;
    delete(id: string): Promise<void>;
}
