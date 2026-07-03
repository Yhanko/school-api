import { Inject, Injectable } from '@nestjs/common';
import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { CreateDisciplinaryDto } from '../../presentation/dtos/disciplinary.dto';
import { DisciplinaryEntity, DisciplinaryStatus } from '../../domain/entities/disciplinary.entity';

@Injectable()
export class CreateDisciplinaryUseCase {
  constructor(
    @Inject(IDisciplinaryRepository)
    private readonly disciplinaryRepository: IDisciplinaryRepository,
  ) {}

  async execute(dto: CreateDisciplinaryDto, reportedById: string, institutionId: string): Promise<DisciplinaryEntity> {
    const record = new DisciplinaryEntity(
      '',
      dto.studentId,
      dto.type,
      dto.severity,
      dto.status || DisciplinaryStatus.PENDING,
      dto.description,
      dto.date ? new Date(dto.date) : new Date(),
      reportedById,
      institutionId,
    );

    return this.disciplinaryRepository.create(record);
  }
}
