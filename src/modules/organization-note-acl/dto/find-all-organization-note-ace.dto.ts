import { IsInt, IsOptional } from 'class-validator';

export class FindAllOrganizationNoteAceDto {
  @IsOptional()
  @IsInt()
  organizationId?: string;

  @IsOptional()
  @IsInt()
  noteId?: string;
}
