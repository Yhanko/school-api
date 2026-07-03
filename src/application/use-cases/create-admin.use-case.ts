import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity, Role } from '../../domain/entities/user.entity';
import { CreateAdminDto } from '../../presentation/dtos/create-admin.dto';

@Injectable()
export class CreateAdminUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IInstitutionRepository)
    private readonly institutionRepository: IInstitutionRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: CreateAdminDto): Promise<Omit<UserEntity, 'password'>> {
    // 1. Check if the institution exists
    const institution = await this.institutionRepository.findById(dto.institutionId);
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    // 2. Check if email is already in use
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 3. Hash password
    const hashedPassword = await this.hashService.hash(dto.password);

    // 4. Create Entity with Role ADMIN
    const userToCreate = new UserEntity(
      '', 
      dto.email,
      dto.name,
      Role.ADMIN, // Explicit role for School Admin
      hashedPassword,
      dto.institutionId
    );

    // 5. Save to Repository
    const createdUser = await this.userRepository.create(userToCreate);

    // 6. Return sanitized user
    const { password, ...result } = createdUser;
    return result as any;
  }
}
