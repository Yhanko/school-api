import { RegulationStatus } from '../../domain/entities/regulation.entity';
export declare class CreateRegulationDto {
    title: string;
    description?: string;
    content?: string;
    fileUrl?: string;
    status?: RegulationStatus;
}
