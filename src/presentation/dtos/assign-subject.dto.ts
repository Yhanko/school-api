import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AssignSubjectDto {
  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsOptional()
  teacherId?: string;
}
