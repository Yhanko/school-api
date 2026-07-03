import { InstitutionEntity } from '../entities/institution.entity';

export const IInstitutionRepository = Symbol('IInstitutionRepository');

export interface IInstitutionRepository {
  findById(id: string): Promise<InstitutionEntity | null>;
  create(institution: InstitutionEntity): Promise<InstitutionEntity>;
}
