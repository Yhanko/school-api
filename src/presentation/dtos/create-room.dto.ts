import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(1)
  capacity: number;

  @IsString()
  @IsOptional()
  floor?: string;

  @IsString()
  @IsNotEmpty()
  academicLevel: string;

  @IsString()
  @IsOptional()
  grade?: string;
}
