import { CreateSubjectDto } from '../presentation/dtos/create-subject.dto';
import { CreateSubjectUseCase } from '../application/use-cases/create-subject.use-case';
import { GetSubjectsUseCase } from '../application/use-cases/get-subjects.use-case';
export declare class SubjectsController {
    private readonly createSubjectUseCase;
    private readonly getSubjectsUseCase;
    constructor(createSubjectUseCase: CreateSubjectUseCase, getSubjectsUseCase: GetSubjectsUseCase);
    createSubject(createSubjectDto: CreateSubjectDto, user: any): Promise<import("../domain/entities/subject.entity").SubjectEntity>;
    getSubjects(user: any): Promise<import("../domain/entities/subject.entity").SubjectEntity[]>;
}
