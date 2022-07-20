import { IsInt, IsOptional } from 'class-validator';

export class FindAllUserReportAceDto {
  @IsOptional()
  @IsInt()
  userId?: string;

  @IsOptional()
  @IsInt()
  reportId?: string;
}
