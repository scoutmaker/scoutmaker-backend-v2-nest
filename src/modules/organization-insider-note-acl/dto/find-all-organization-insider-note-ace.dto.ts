import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationInsiderNoteAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: number;

  @IsOptional()
  @IsInt()
  insiderNoteId?: number;
}
