import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserPermissionsDto {
  @IsBoolean()
  @IsOptional()
  dashboard?: boolean;

  @IsBoolean()
  @IsOptional()
  students?: boolean;

  @IsBoolean()
  @IsOptional()
  teachers?: boolean;

  @IsBoolean()
  @IsOptional()
  classes?: boolean;

  @IsBoolean()
  @IsOptional()
  financial?: boolean;

  @IsBoolean()
  @IsOptional()
  activities?: boolean;

  @IsBoolean()
  @IsOptional()
  payments?: boolean;

  @IsBoolean()
  @IsOptional()
  attendance?: boolean;

  @IsBoolean()
  @IsOptional()
  discipline?: boolean;

  @IsBoolean()
  @IsOptional()
  permissions?: boolean;
}
