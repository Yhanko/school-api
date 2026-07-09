import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  period: string;

  @IsString()
  @IsNotEmpty()
  academicLevel: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsString()
  course?: string;

  @IsString()
  @IsNotEmpty()
  room: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  teacherIds?: string[];
}
