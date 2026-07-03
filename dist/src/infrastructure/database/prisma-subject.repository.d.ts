import { PrismaService } from '../../prisma/prisma.service';
import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { SubjectEntity } from '../../domain/entities/subject.entity';
export declare class PrismaSubjectRepository implements ISubjectRepository {
    private prisma;
    constructor(prisma: PrismaService);
    private mapToEntity;
    create(subject: SubjectEntity): Promise<SubjectEntity>;
    findAllByInstitution(institutionId: string): Promise<SubjectEntity[]>;
    findById(id: string): Promise<SubjectEntity | null>;
    findByStudent(studentId: string): Promise<SubjectEntity[]>;
    delete(id: string): Promise<void>;
}
