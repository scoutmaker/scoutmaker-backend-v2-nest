import { IsOptional, IsString } from 'class-validator';

export class FindAllOrganizationInsiderNoteAceDto {
  @IsOptional()
  @IsString()
  organizationId?: string;

  @IsOptional()
  @IsString()
  insiderNoteId?: string;
}
