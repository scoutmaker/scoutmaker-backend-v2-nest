import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationInsiderNoteAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: string;

  @IsOptional()
  @IsInt()
  insiderNoteId?: string;
}
