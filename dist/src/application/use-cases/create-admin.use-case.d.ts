import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateAdminDto } from '../../presentation/dtos/create-admin.dto';
export declare class CreateAdminUseCase {
    private readonly userRepository;
    private readonly institutionRepository;
    private readonly hashService;
    constructor(userRepository: IUserRepository, institutionRepository: IInstitutionRepository, hashService: IHashService);
    execute(dto: CreateAdminDto): Promise<Omit<UserEntity, 'password'>>;
}
