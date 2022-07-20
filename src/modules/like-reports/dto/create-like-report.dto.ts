import { IsInt } from 'class-validator';

export class CreateLikeReportDto {
  @IsInt()
  reportId: number;
}
