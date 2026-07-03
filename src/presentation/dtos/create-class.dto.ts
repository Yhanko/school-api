import { IsArray, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  room: string;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  teacherIds: string[];
}
