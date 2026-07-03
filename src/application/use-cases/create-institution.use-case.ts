import { Inject, Injectable } from '@nestjs/common';
import { IInstitutionRepository } from '../../domain/repositories/institution.repository.interface';
import { InstitutionEntity } from '../../domain/entities/institution.entity';
import { CreateInstitutionDto } from '../../presentation/dtos/create-institution.dto';

@Injectable()
export class CreateInstitutionUseCase {
  constructor(
    @Inject(IInstitutionRepository)
    private readonly institutionRepository: IInstitutionRepository,
  ) {}

  async execute(dto: CreateInstitutionDto): Promise<InstitutionEntity> {
    const institutionToCreate = new InstitutionEntity(
      '', 
      dto.name,
      dto.email,
      dto.address,
    );

    return this.institutionRepository.create(institutionToCreate);
  }
}
