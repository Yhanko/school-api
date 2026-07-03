import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { RegulationStatus } from '../../domain/entities/regulation.entity';

export class CreateRegulationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsEnum(RegulationStatus)
  @IsOptional()
  status?: RegulationStatus;
}
