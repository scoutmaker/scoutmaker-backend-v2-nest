import { IsOptional, IsString } from 'class-validator';

export class FindAllReportTemplatesDto {
  @IsOptional()
  @IsString()
  name?: string;
}
