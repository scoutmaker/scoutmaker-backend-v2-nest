import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserReportAceDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  reportId?: number;
}
