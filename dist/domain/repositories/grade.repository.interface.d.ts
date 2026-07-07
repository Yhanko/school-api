import { GradeEntity } from '../entities/grade.entity';
export declare const IGradeRepository: unique symbol;
export interface IGradeRepository {
    create(grade: GradeEntity): Promise<GradeEntity>;
    findByStudentAndClass(studentId: string, classId: string): Promise<GradeEntity[]>;
    findById(id: string): Promise<GradeEntity | null>;
    update(id: string, data: Partial<GradeEntity>): Promise<GradeEntity>;
    delete(id: string): Promise<void>;
}
