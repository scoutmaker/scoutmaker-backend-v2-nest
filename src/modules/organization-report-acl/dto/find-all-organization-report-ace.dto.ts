import { IsOptional, IsString } from 'class-validator';

export class FindAllOrganizationReportAceDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  reportId?: string;
}
