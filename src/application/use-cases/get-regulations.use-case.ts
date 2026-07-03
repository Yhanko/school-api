import { Inject, Injectable } from '@nestjs/common';
import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { RegulationEntity, RegulationStatus } from '../../domain/entities/regulation.entity';

@Injectable()
export class GetRegulationsUseCase {
  constructor(
    @Inject(IRegulationRepository)
    private readonly regulationRepository: IRegulationRepository,
  ) {}

  async execute(institutionId: string, status?: RegulationStatus): Promise<RegulationEntity[]> {
    return this.regulationRepository.findAllByInstitution(institutionId, status);
  }
}
