import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationReportAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: number;

  @IsOptional()
  @IsInt()
  reportId?: number;
}
