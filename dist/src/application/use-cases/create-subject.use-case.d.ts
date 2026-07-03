import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { CreateSubjectDto } from '../../presentation/dtos/create-subject.dto';
import { SubjectEntity } from '../../domain/entities/subject.entity';
export declare class CreateSubjectUseCase {
    private readonly subjectRepository;
    constructor(subjectRepository: ISubjectRepository);
    execute(dto: CreateSubjectDto, institutionId: string): Promise<SubjectEntity>;
}
