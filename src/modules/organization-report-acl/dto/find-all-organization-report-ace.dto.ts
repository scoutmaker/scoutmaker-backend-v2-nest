import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationReportAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: string;

  @IsOptional()
  @IsInt()
  reportId?: string;
}
