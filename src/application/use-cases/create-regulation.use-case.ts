import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IRegulationRepository } from '../../domain/repositories/regulation.repository.interface';
import { CreateRegulationDto } from '../../presentation/dtos/create-regulation.dto';
import { RegulationEntity, RegulationStatus } from '../../domain/entities/regulation.entity';

@Injectable()
export class CreateRegulationUseCase {
  constructor(
    @Inject(IRegulationRepository)
    private readonly regulationRepository: IRegulationRepository,
  ) {}

  async execute(dto: CreateRegulationDto, authorId: string, institutionId: string): Promise<RegulationEntity> {
    if (!dto.content && !dto.fileUrl) {
      throw new BadRequestException('Either content or fileUrl must be provided.');
    }

    const regulation = new RegulationEntity(
      '',
      dto.title,
      dto.description || null,
      dto.content || null,
      dto.fileUrl || null,
      dto.status || RegulationStatus.DRAFT,
      institutionId,
      authorId,
    );

    return this.regulationRepository.create(regulation);
  }
}
