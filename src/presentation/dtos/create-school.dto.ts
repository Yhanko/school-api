import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @IsEmail()
  @IsOptional()
  schoolEmail?: string;

  @IsString()
  @IsOptional()
  schoolAddress?: string;

  @IsString()
  @IsOptional()
  schoolPhone?: string;

  @IsString()
  @IsNotEmpty()
  adminName: string;

  @IsEmail()
  @IsNotEmpty()
  adminEmail: string;

  @IsString()
  @IsNotEmpty()
  adminPassword: string;

  @IsString()
  @IsNotEmpty()
  planId: string;
}
