import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { SubjectEntity } from '../../domain/entities/subject.entity';
export declare class GetSubjectsUseCase {
    private readonly subjectRepository;
    constructor(subjectRepository: ISubjectRepository);
    execute(institutionId: string, userId?: string, role?: string): Promise<SubjectEntity[]>;
}
