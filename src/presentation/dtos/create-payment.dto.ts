import { IsEnum, IsNotEmpty, IsNumber, IsString, Min, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  type: string; // 'enrollment' | 'tuition' | 'activity'

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  dueDate?: string;
}
