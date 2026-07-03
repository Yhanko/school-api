import { IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

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
}
