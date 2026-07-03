import { Inject, Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity, Role } from '../../domain/entities/user.entity';
import { CreateStudentDto } from '../../presentation/dtos/create-student.dto';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IInstitutionRepository)
    private readonly institutionRepository: IInstitutionRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
  ) {}

  async execute(dto: CreateStudentDto, institutionId: string): Promise<Omit<UserEntity, 'password'>> {
    if (!institutionId) {
      throw new ForbiddenException('You must belong to an institution to create a student');
    }

    // 1. Check if the institution exists
    const institution = await this.institutionRepository.findById(institutionId);
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

    // 4. Create Entity with Role STUDENT
    const userToCreate = new UserEntity(
      '', 
      dto.email,
      dto.name,
      Role.STUDENT, // Explicit role for Student
      hashedPassword,
      institutionId
    );

    // 5. Save to Repository
    const createdUser = await this.userRepository.create(userToCreate);

    // 6. Return sanitized user
    const { password, ...result } = createdUser;
    return result as any;
  }
}
