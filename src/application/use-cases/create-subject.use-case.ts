import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { CreateSubjectDto } from '../../presentation/dtos/create-subject.dto';
import { SubjectEntity } from '../../domain/entities/subject.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLoggerService, LogAction } from '../services/activity-logger.service';

@Injectable()
export class CreateSubjectUseCase {
  constructor(
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
    private prisma: PrismaService,
    private readonly activityLogger: ActivityLoggerService,
  ) {}

  async execute(dto: CreateSubjectDto, institutionId: string): Promise<SubjectEntity> {
    if (!institutionId) {
      throw new BadRequestException('Institution ID is required');
    }

    const subjectEntity = new SubjectEntity(
      '',
      dto.name,
      institutionId,
      dto.code,
    );

    const createdSubject = await this.subjectRepository.create(subjectEntity);

    // Bulk assignment logic
    if ((dto.classIds && dto.classIds.length > 0) || (dto.academicLevels && dto.academicLevels.length > 0)) {
      // Find all matching classes
      const matchingClasses = await this.prisma.class.findMany({
        where: {
          institutionId,
          OR: [
            ...(dto.classIds && dto.classIds.length > 0 ? [{ id: { in: dto.classIds } }] : []),
            ...(dto.academicLevels && dto.academicLevels.length > 0 ? [{ academicLevel: { in: dto.academicLevels } }] : [])
          ]
        },
        select: { id: true }
      });

      if (matchingClasses.length > 0) {
        const classSubjectData = matchingClasses.map(cls => ({
          classId: cls.id,
          subjectId: createdSubject.id,
          teacherId: dto.teacherId || undefined,
        }));

        await this.prisma.classSubject.createMany({
          data: classSubjectData,
          skipDuplicates: true,
        });
      }
    }

    await this.activityLogger.logAction(
      LogAction.CREATE_SUBJECT,
      'Subject',
      `Created subject ${createdSubject.name} (Code: ${createdSubject.code})`,
      undefined,
      institutionId
    );

    return createdSubject;
  }
}
