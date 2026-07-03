import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MarkAttendanceDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsOptional()
  subjectId?: string;

  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  status: string; // 'present', 'absent', 'late', 'excused'
}
