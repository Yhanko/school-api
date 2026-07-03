import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { RegulationEntity, RegulationStatus } from '../../domain/entities/regulation.entity';

@Injectable()
export class PublishRegulationUseCase {
  constructor(
    @Inject(IRegulationRepository)
    private readonly regulationRepository: IRegulationRepository,
  ) {}

  async execute(id: string): Promise<RegulationEntity> {
    const regulation = await this.regulationRepository.findById(id);
    if (!regulation) {
      throw new NotFoundException('Regulation not found');
    }

    return this.regulationRepository.updateStatus(id, RegulationStatus.PUBLISHED);
  }
}
