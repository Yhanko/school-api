import { Inject, Injectable } from '@nestjs/common';
import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { DisciplinaryEntity } from '../../domain/entities/disciplinary.entity';

@Injectable()
export class GetDisciplinaryRecordsUseCase {
  constructor(
    @Inject(IDisciplinaryRepository)
    private readonly disciplinaryRepository: IDisciplinaryRepository,
  ) {}

  async execute(institutionId: string, studentId?: string): Promise<DisciplinaryEntity[]> {
    return this.disciplinaryRepository.findAll(institutionId, studentId);
  }
}
