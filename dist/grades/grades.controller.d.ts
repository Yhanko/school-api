import { CreateGradeDto } from '../presentation/dtos/create-grade.dto';
import { CreateGradeUseCase } from '../application/use-cases/create-grade.use-case';
import { GetStudentGradesUseCase } from '../application/use-cases/get-student-grades.use-case';
export declare class GradesController {
    private readonly createGradeUseCase;
    private readonly getStudentGradesUseCase;
    constructor(createGradeUseCase: CreateGradeUseCase, getStudentGradesUseCase: GetStudentGradesUseCase);
    createGrade(createGradeDto: CreateGradeDto, user: any): Promise<import("../domain/entities/grade.entity").GradeEntity>;
    getStudentGrades(studentId: string, classId: string, user: any): Promise<import("../domain/entities/grade.entity").GradeEntity[]>;
}
