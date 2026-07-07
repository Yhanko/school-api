import { CreateClassDto } from '../presentation/dtos/create-class.dto';
import { CreateClassUseCase } from '../application/use-cases/create-class.use-case';
import { EnrollStudentUseCase } from '../application/use-cases/enroll-student.use-case';
export declare class ClassesController {
    private readonly createClassUseCase;
    private readonly enrollStudentUseCase;
    constructor(createClassUseCase: CreateClassUseCase, enrollStudentUseCase: EnrollStudentUseCase);
    getClasses(user: any): Promise<import("../domain/entities/class.entity").ClassEntity[]>;
    getClassesByTeacher(teacherId: string, user: any): Promise<import("../domain/entities/class.entity").ClassEntity[]>;
    getClassById(id: string): Promise<import("../domain/entities/class.entity").ClassEntity | null>;
    createClass(createClassDto: CreateClassDto, user: any): Promise<import("../domain/entities/class.entity").ClassEntity>;
    enrollStudent(classId: string, studentId: string, user: any): Promise<void>;
}
