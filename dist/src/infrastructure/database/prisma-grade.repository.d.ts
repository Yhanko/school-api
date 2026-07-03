import { PrismaService } from '../../prisma/prisma.service';
import { IGradeRepository } from '../../domain/repositories/grade.repository.interface';
import { GradeEntity } from '../../domain/entities/grade.entity';
export declare class PrismaGradeRepository implements IGradeRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(grade: GradeEntity): Promise<GradeEntity>;
    findByStudentAndClass(studentId: string, classId: string): Promise<GradeEntity[]>;
    findById(id: string): Promise<GradeEntity | null>;
    update(id: string, data: Partial<GradeEntity>): Promise<GradeEntity>;
    delete(id: string): Promise<void>;
}
