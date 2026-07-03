import { IsNotEmpty, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { SeverityLevel, DisciplinaryStatus } from '../../domain/entities/disciplinary.entity';

export class CreateDisciplinaryDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsEnum(SeverityLevel)
  @IsNotEmpty()
  severity: SeverityLevel;

  @IsEnum(DisciplinaryStatus)
  @IsOptional()
  status?: DisciplinaryStatus;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsOptional()
  date?: Date;
}

export class UpdateDisciplinaryStatusDto {
  @IsEnum(DisciplinaryStatus)
  @IsNotEmpty()
  status: DisciplinaryStatus;
}
