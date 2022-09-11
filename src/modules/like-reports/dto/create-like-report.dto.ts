import { IsString } from 'class-validator';

export class CreateLikeReportDto {
  @IsString()
  reportId: string;
}
