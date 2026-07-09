import { Inject, Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IHashService } from '../interfaces/hash.service.interface';
import { UserEntity, Role } from '../../domain/entities/user.entity';
import { EmployeeProfileEntity } from '../../domain/entities/employee-profile.entity';
import { CreateStudentDto } from '../../presentation/dtos/create-student.dto';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';
import { AcademicYearsService } from '../../academic-years/academic-years.service';

@Injectable()
export class CreateStudentUseCase {
  constructor(
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IInstitutionRepository)
    private readonly institutionRepository: IInstitutionRepository,
    @Inject(IHashService)
    private readonly hashService: IHashService,
    private readonly academicYearsService: AcademicYearsService,
    private readonly activityLogger: ActivityLoggerService,
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

    // 3. Handle Parent Creation or Linking
    let parentId: string | null = null;
    let newParentCreated = false;
    if (dto.parentEmail && dto.parentName && dto.parentPassword) {
      const existingParent = await this.userRepository.findByEmail(dto.parentEmail);
      if (existingParent) {
        parentId = existingParent.id;
      } else {
        const hashedParentPassword = await this.hashService.hash(dto.parentPassword);
        const parentProfile = new EmployeeProfileEntity('', '', dto.parentPhone, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        const parentToCreate = new UserEntity(
          '', 
          dto.parentEmail,
          dto.parentName,
          Role.PARENT,
          hashedParentPassword,
          institutionId,
          parentProfile
        );
        const createdParent = await this.userRepository.create(parentToCreate);
        parentId = createdParent.id;
        newParentCreated = true;

        await this.activityLogger.logAction(
          LogAction.CREATE_PARENT,
          'User',
          `Created parent profile for ${createdParent.name} (${createdParent.email})`,
          createdParent.id,
          institutionId
        );
      }
    }

    // 4. Hash password
    const hashedPassword = await this.hashService.hash(dto.password);

    // 5. Create student profile
    const studentProfile = new EmployeeProfileEntity('', '', dto.phone, undefined, undefined, undefined, undefined, dto.city, undefined, undefined);

    let enrollments: any[] | undefined = undefined;

    if (dto.classId) {
      const activeYear = await this.academicYearsService.getActiveYear(institutionId);
      enrollments = [{
        id: '',
        classId: dto.classId,
        academicYearId: activeYear.id,
        status: 'active'
      }];
    }

    // 6. Create Entity with Role STUDENT
    const userToCreate = new UserEntity(
      '', 
      dto.email,
      dto.name,
      Role.STUDENT,
      hashedPassword,
      institutionId,
      studentProfile,
      undefined,
      undefined,
      parentId,
      enrollments,
      dto.studentNumber
    );

    // 7. Save to Repository
    const createdUser = await this.userRepository.create(userToCreate);

    // 8. Log the student creation
    await this.activityLogger.logAction(
      LogAction.CREATE_STUDENT,
      'User',
      `Created student profile for ${createdUser.name} (${createdUser.email})`,
      createdUser.id,
      institutionId
    );

    // 9. Return sanitized user
    const { password, ...result } = createdUser;
    return result as any;
  }
}
