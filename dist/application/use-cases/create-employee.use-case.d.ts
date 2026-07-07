import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IEmployeeProfileRepository } from '../../domain/repositories/employee-profile.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateEmployeeDto } from '../../presentation/dtos/create-employee.dto';
export declare class CreateEmployeeUseCase {
    private readonly userRepository;
    private readonly institutionRepository;
    private readonly profileRepository;
    private readonly hashService;
    constructor(userRepository: IUserRepository, institutionRepository: IInstitutionRepository, profileRepository: IEmployeeProfileRepository, hashService: IHashService);
    execute(dto: CreateEmployeeDto, institutionId: string): Promise<Omit<UserEntity, 'password'>>;
}
