import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDisciplinaryRepository } from '../../domain/repositories/disciplinary.repository.interface';
import { DisciplinaryEntity, DisciplinaryStatus } from '../../domain/entities/disciplinary.entity';
import { UpdateDisciplinaryStatusDto } from '../../presentation/dtos/disciplinary.dto';

@Injectable()
export class UpdateDisciplinaryStatusUseCase {
  constructor(
    @Inject(IDisciplinaryRepository)
    private readonly disciplinaryRepository: IDisciplinaryRepository,
  ) {}

  async execute(id: string, dto: UpdateDisciplinaryStatusDto): Promise<DisciplinaryEntity> {
    const record = await this.disciplinaryRepository.findById(id);
    if (!record) {
      throw new NotFoundException('Disciplinary record not found');
    }

    return this.disciplinaryRepository.updateStatus(id, dto.status);
  }
}
