import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  subjectId: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  term: string; // 'first', 'second', 'third', 'final'

  @IsNumber()
  @Min(0)
  @Max(20)
  value: number;
}
