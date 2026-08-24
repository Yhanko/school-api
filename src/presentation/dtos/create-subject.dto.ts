import { IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  academicLevels?: string[];

  @IsOptional()
  @IsString()
  teacherId?: string;
}
