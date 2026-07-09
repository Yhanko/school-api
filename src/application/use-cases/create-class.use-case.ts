import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { IClassRepository } from '../../domain/repositories/class.repository.interface';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateClassDto } from '../../presentation/dtos/create-class.dto';
import { ClassEntity } from '../../domain/entities/class.entity';
import { Role } from '../../domain/entities/user.entity';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';
import { AcademicYearsService } from '../../academic-years/academic-years.service';

@Injectable()
export class CreateClassUseCase {
  constructor(
    @Inject(IClassRepository)
    private readonly classRepository: IClassRepository,
    @Inject(IInstitutionRepository)
    private readonly institutionRepository: IInstitutionRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    private readonly activityLogger: ActivityLoggerService,
    private readonly academicYearsService: AcademicYearsService,
  ) {}

  async execute(dto: CreateClassDto, institutionId: string): Promise<ClassEntity> {
    if (!institutionId) {
      throw new BadRequestException('Institution ID is required from the logged in user');
    }

    const institution = await this.institutionRepository.findById(institutionId);
    if (!institution) {
      throw new NotFoundException('Institution not found');
    }

    // Validate that all teachers exist and belong to the same institution with role TEACHER
    if (dto.teacherIds && dto.teacherIds.length > 0) {
      for (const teacherId of dto.teacherIds) {
        const teacher = await this.userRepository.findById(teacherId);
        if (!teacher) {
          throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
        }
        if (teacher.institutionId !== institutionId) {
          throw new BadRequestException(`Teacher ${teacherId} does not belong to your institution`);
        }
        if (teacher.role !== Role.TEACHER) {
          throw new BadRequestException(`User ${teacherId} is not a Teacher`);
        }
      }
    }

    // Get or Create Active Academic Year
    const activeYear = await this.academicYearsService.getActiveYear(institutionId);

    const classEntity = new ClassEntity(
      '',
      dto.name,
      dto.period,
      dto.academicLevel,
      dto.room,
      dto.capacity,
      institutionId,
      activeYear.id,
      undefined, // teachers
      dto.grade,
      dto.course
    );

    const createdClass = await this.classRepository.create(classEntity, dto.teacherIds || []);

    await this.activityLogger.logAction(
      LogAction.CREATE_CLASS,
      'Class',
      `Created class ${createdClass.name} (${createdClass.period}, Grade: ${createdClass.grade})`,
      undefined,
      institutionId
    );

    return createdClass;
  }

  async executeGetByInstitution(institutionId: string) {
    return this.classRepository.findByInstitution(institutionId);
  }

  async executeGetByTeacher(teacherId: string, institutionId: string) {
    const all = await this.classRepository.findByInstitution(institutionId);
    return all.filter((c: any) =>
      c.teachers?.some((t: any) => t.id === teacherId)
    );
  }

  async executeGetById(id: string) {
    return this.classRepository.findById(id);
  }
}
