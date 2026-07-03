import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IGradeRepository } from '../../domain/repositories/grade.repository.interface';
import { GradeEntity } from '../../domain/entities/grade.entity';

@Injectable()
export class GetStudentGradesUseCase {
  constructor(
    @Inject(IGradeRepository)
    private readonly gradeRepository: IGradeRepository,
  ) {}

  async execute(studentId: string, classId: string, institutionId: string): Promise<GradeEntity[]> {
    if (!studentId || !classId) {
      throw new BadRequestException('Student ID and Class ID are required');
    }
    
    // Future validation: ensure the student belongs to institutionId
    return this.gradeRepository.findByStudentAndClass(studentId, classId);
  }
}
