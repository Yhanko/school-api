import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { CreateSubjectDto } from '../../presentation/dtos/create-subject.dto';
import { SubjectEntity } from '../../domain/entities/subject.entity';

@Injectable()
export class CreateSubjectUseCase {
  constructor(
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
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

    return this.subjectRepository.create(subjectEntity);
  }
}
