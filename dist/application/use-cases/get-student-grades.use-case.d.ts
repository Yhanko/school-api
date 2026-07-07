import { IGradeRepository } from '../../domain/repositories/grade.repository.interface';
import { GradeEntity } from '../../domain/entities/grade.entity';
export declare class GetStudentGradesUseCase {
    private readonly gradeRepository;
    constructor(gradeRepository: IGradeRepository);
    execute(studentId: string, classId: string, institutionId: string): Promise<GradeEntity[]>;
}
