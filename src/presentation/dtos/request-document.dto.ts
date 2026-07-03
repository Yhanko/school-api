import { IsNotEmpty, IsString } from 'class-validator';

export class RequestDocumentDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  type: string; // 'certificate', 'declaration', 'transcript'
}
