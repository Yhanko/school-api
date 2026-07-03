import { IClassRepository } from '../../domain/repositories/class.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateClassDto } from '../../presentation/dtos/create-class.dto';
import { ClassEntity } from '../../domain/entities/class.entity';
export declare class CreateClassUseCase {
    private readonly classRepository;
    private readonly institutionRepository;
    private readonly userRepository;
    constructor(classRepository: IClassRepository, institutionRepository: IInstitutionRepository, userRepository: IUserRepository);
    execute(dto: CreateClassDto, institutionId: string): Promise<ClassEntity>;
    executeGetByInstitution(institutionId: string): Promise<ClassEntity[]>;
    executeGetByTeacher(teacherId: string, institutionId: string): Promise<ClassEntity[]>;
    executeGetById(id: string): Promise<ClassEntity | null>;
}
