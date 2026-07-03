import { IGradeRepository } from '../../domain/repositories/grade.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateGradeDto } from '../../presentation/dtos/create-grade.dto';
import { GradeEntity } from '../../domain/entities/grade.entity';
import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateGradeUseCase {
    private readonly gradeRepository;
    private readonly userRepository;
    private readonly prisma;
    constructor(gradeRepository: IGradeRepository, userRepository: IUserRepository, prisma: PrismaService);
    execute(dto: CreateGradeDto, teacherId: string, institutionId: string): Promise<GradeEntity>;
}
