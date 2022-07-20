import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateLikeReportDto {
  @IsInt()
  @Type(() => Number)
  reportId: number;
}
