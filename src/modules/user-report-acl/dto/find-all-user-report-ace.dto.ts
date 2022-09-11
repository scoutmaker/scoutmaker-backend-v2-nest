import { IsOptional, IsString } from 'class-validator';

export class FindAllUserReportAceDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  reportId?: string;
}
