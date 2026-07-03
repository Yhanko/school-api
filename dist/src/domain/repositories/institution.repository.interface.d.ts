import { InstitutionEntity } from '../entities/institution.entity';
export declare const IInstitutionRepository: unique symbol;
export interface IInstitutionRepository {
    findById(id: string): Promise<InstitutionEntity | null>;
    create(institution: InstitutionEntity): Promise<InstitutionEntity>;
}
