import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateStudentDto } from '../../presentation/dtos/create-student.dto';
export declare class CreateStudentUseCase {
    private readonly userRepository;
    private readonly institutionRepository;
    private readonly hashService;
    constructor(userRepository: IUserRepository, institutionRepository: IInstitutionRepository, hashService: IHashService);
    execute(dto: CreateStudentDto, institutionId: string): Promise<Omit<UserEntity, 'password'>>;
}
