import { Inject, Injectable } from '@nestjs/common';
import { ISubjectRepository } from '../../domain/repositories/subject.repository.interface';
import { SubjectEntity } from '../../domain/entities/subject.entity';
import { Role } from '../../domain/entities/user.entity';

@Injectable()
export class GetSubjectsUseCase {
  constructor(
    @Inject(ISubjectRepository)
    private readonly subjectRepository: ISubjectRepository,
  ) {}

  async execute(institutionId: string, userId?: string, role?: string): Promise<SubjectEntity[]> {
    if (role === Role.STUDENT && userId) {
      return this.subjectRepository.findByStudent(userId);
    }
    return this.subjectRepository.findAllByInstitution(institutionId);
  }
}
