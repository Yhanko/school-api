import { IClassRepository } from '../../domain/repositories/class.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
export declare class EnrollStudentUseCase {
    private readonly classRepository;
    private readonly userRepository;
    private readonly prisma;
    constructor(classRepository: IClassRepository, userRepository: IUserRepository, prisma: PrismaService);
    execute(classId: string, studentId: string, institutionId: string): Promise<void>;
}
