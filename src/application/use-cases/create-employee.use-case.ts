import { Inject, Injectable, ConflictException, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IEmployeeProfileRepository } from '../../domain/repositories/employee-profile.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity, Role } from '../../domain/entities/user.entity';
import { EmployeeProfileEntity } from '../../domain/entities/employee-profile.entity';
import { CreateEmployeeDto } from '../../presentation/dtos/create-employee.dto';
import { IClassRepository } from '../../domain/repositories/class.repository.interface';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';

@Injectable()
export class CreateEmployeeUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IInstitutionRepository)
    private readonly institutionRepository: IInstitutionRepository,
    @Inject(IEmployeeProfileRepository)
    private readonly profileRepository: IEmployeeProfileRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  async execute(dto: CreateEmployeeDto, institutionId: string): Promise<Omit<UserEntity, 'password'>> {
    if (!institutionId) {
      throw new ForbiddenException('You must belong to an institution to register an employee');
    }

    // Only allow specific roles to be created by this use case
    const allowedRoles = [Role.TEACHER, Role.SECRETARY, Role.ADMIN, Role.ASSOCIATION_MEMBER];
    if (!allowedRoles.includes(dto.role)) {
      throw new BadRequestException(`Role ${dto.role} is not a valid employee role`);
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

    // 4. Create Entity with the requested employee role
    const userToCreate = new UserEntity(
      '', 
      dto.email,
      dto.name,
      dto.role,
      hashedPassword,
      institutionId
    );

    // 5. Save User to Repository
    const createdUser = await this.userRepository.create(userToCreate);

    // 6. Create Profile Entity and Save to Repository
    const profileToCreate = new EmployeeProfileEntity(
      '',
      createdUser.id,
      dto.phone,
      dto.address,
      dto.photoUrl,
      dto.university,
      dto.degree,
      dto.educationPeriod,
      dto.city,
      dto.cvUrl,
      dto.biUrl
    );
    const createdProfile = await this.profileRepository.create(profileToCreate);

    // 6.5 Connect to Class if classId is provided
    if (dto.classId && dto.role === Role.TEACHER) {
      await this.classRepository.addTeacherToClass(dto.classId, createdUser.id);
    }

    await this.activityLogger.logAction(
      LogAction.CREATE_EMPLOYEE,
      'User',
      `Created employee profile for ${createdUser.name} (${createdUser.email}) with role ${createdUser.role}`,
      createdUser.id,
      institutionId
    );

    // 7. Return sanitized user with profile
    const { password, ...result } = createdUser;
    return { ...result, profile: createdProfile } as any;
  }
}
